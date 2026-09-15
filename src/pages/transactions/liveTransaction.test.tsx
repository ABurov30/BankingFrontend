import { act, cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import type { StompConfig } from '@stomp/stompjs'
import TransactionsPage from './TransactionsPage'
import { TransactionStatusDialog } from './components/TransactionStatusDialog'
import { renderWithProviders } from '@/test/renderWithProviders'
import { store } from '@/app/store'
const socket = vi.hoisted(() => ({
  config: {} as StompConfig,
  message: (_message: { body: string }) => {
    void _message
  },
  deactivate: vi.fn(),
  subscribe: vi.fn(),
}))
vi.mock('@stomp/stompjs', () => ({
  Client: class {
    constructor(config: StompConfig) {
      socket.config = config
    }
    activate() {}
    deactivate = socket.deactivate
    subscribe(destination: string, callback: typeof socket.message) {
      socket.subscribe(destination)
      socket.message = callback
    }
  },
}))
vi.mock('@/shared/api/transactionApi', async (original) => ({
  ...(await original<typeof import('@/shared/api/transactionApi')>()),
  useGetMyTransactionsQuery: () => ({
    data: [
      {
        transactionId: 'tx-1',
        status: 'CREATED',
        currency: 'USD',
        minorUnits: 1234,
      },
    ],
    isFetching: false,
  }),
}))
afterEach(cleanup)
it('tracks a transaction, merges live updates and unsubscribes when closed', () => {
  renderWithProviders(<TransactionsPage />)
  fireEvent.click(screen.getByRole('button', { name: 'Отслеживать' }))
  expect(screen.getByRole('dialog')).toBeTruthy()
  act(() => socket.config.onConnect?.({} as never))
  expect(socket.subscribe).toHaveBeenCalledWith('/user/queue/transactions/tx-1')
  act(() =>
    socket.message({
      body: JSON.stringify({
        status: 'COMPLETED',
        sourceAccount: { accountNumber: '111' },
        targetAccount: { accountNumber: '222' },
      }),
    }),
  )
  expect(screen.getByText('COMPLETED')).toBeTruthy()
  for (const body of ['invalid json', 'null', '42'])
    act(() => socket.message({ body }))
  expect(screen.getByText('COMPLETED')).toBeTruthy()
  fireEvent.keyDown(window, { key: 'Escape' })
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(socket.deactivate).toHaveBeenCalled()
  expect(document.body.style.overflow).toBe('')
  fireEvent.click(screen.getByRole('button', { name: 'New transfer' }))
  expect(store.getState().rightPanel.content).toBe('transfer')
})
it('renders missing transaction details and supports close button', () => {
  const close = vi.fn()
  renderWithProviders(
    <TransactionStatusDialog onClose={close} transaction={{}} />,
  )
  expect(screen.getAllByText('-').length).toBeGreaterThan(0)
  fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }))
  expect(close).toHaveBeenCalledOnce()
})
