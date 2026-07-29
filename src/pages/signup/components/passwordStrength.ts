import styles from '../styles.module.css'

export type PasswordStrength = {
  colorClassName: string
  label: string
  score: number
}

export function getPasswordStrength(
  password: string,
  labels: {
    empty: string
    fair: string
    good: string
    strong: string
    weak: string
  },
): PasswordStrength {
  if (!password) {
    return {
      colorClassName: styles['signup__rule--muted'],
      label: labels.empty,
      score: 0,
    }
  }

  const checks = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
    password.length >= 12,
  ]
  const points = checks.filter(Boolean).length

  if (points <= 1) {
    return {
      colorClassName: styles['signup__rule--danger'],
      label: labels.weak,
      score: 1,
    }
  }

  if (points <= 2) {
    return {
      colorClassName: styles['signup__rule--warning'],
      label: labels.fair,
      score: 2,
    }
  }

  if (points <= 3) {
    return {
      colorClassName: styles['signup__rule--success'],
      label: labels.good,
      score: 3,
    }
  }

  return {
    colorClassName: styles['signup__rule--default'],
    label: labels.strong,
    score: 4,
  }
}
