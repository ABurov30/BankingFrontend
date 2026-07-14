type BackendErrorBody = {
  error?: unknown
  message?: unknown
  title?: unknown
}

const fallbackErrorMessage = 'Unexpected server error. Please try again.'

function isBackendErrorBody(value: unknown): value is BackendErrorBody {
  return typeof value === 'object' && value !== null
}

function getMessageFromValue(value: unknown): string | null {
  if (typeof value === 'string' && value.length > 0) {
    return value
  }

  if (Array.isArray(value)) {
    const messages = value.filter(
      (message): message is string =>
        typeof message === 'string' && message.length > 0,
    )

    return messages.length > 0 ? messages.join('\n') : null
  }

  return null
}

export function getApiErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (!isBackendErrorBody(error) || !('data' in error)) {
    return fallbackErrorMessage
  }

  const { data } = error

  if (typeof data === 'string') {
    return data
  }

  if (!isBackendErrorBody(data)) {
    return fallbackErrorMessage
  }

  const message = data.message ?? data.error ?? data.title
  const parsedMessage = getMessageFromValue(message)

  return parsedMessage ?? fallbackErrorMessage
}
