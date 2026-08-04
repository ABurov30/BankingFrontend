import { Outlet } from 'react-router-dom'

import { useAppSelector } from '@/app/hooks'
import { AccessDenied } from '@/components/AccessDenied'
import { selectCurrentUser } from '@/features/user/userSlice'
import type { Role } from '@/shared/api/enums'

export function RoleRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const role = useAppSelector(selectCurrentUser)?.role

  if (!role || !allowedRoles.includes(role)) {
    return <AccessDenied />
  }

  return <Outlet />
}
