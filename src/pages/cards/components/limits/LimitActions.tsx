import { Pencil, Save } from 'lucide-react'

import type { LimitsTranslationFunction } from './types'
import styles from '../../styles.module.css'

export function LimitActions({
  hasCard,
  isDirty,
  isEditing,
  isUpdating,
  onCancel,
  onEdit,
  t,
}: {
  hasCard: boolean
  isDirty: boolean
  isEditing: boolean
  isUpdating: boolean
  onCancel: () => void
  onEdit: () => void
  t: LimitsTranslationFunction
}) {
  return (
    <div className={styles['cards__limits-actions']}>
      {isEditing ? (
        <>
          <button
            className={styles['cards__limits-cancel']}
            disabled={isUpdating}
            onClick={onCancel}
            type="button"
          >
            {t('cancel')}
          </button>
          <button
            className={styles['cards__limits-save']}
            disabled={!hasCard || !isDirty || isUpdating}
            type="submit"
          >
            <Save className={styles['cards__limits-save-icon']} />
            {isUpdating ? t('saving') : t('saveLimits')}
          </button>
        </>
      ) : (
        <button
          className={styles['cards__limits-save']}
          disabled={!hasCard}
          onClick={onEdit}
          type="button"
        >
          <Pencil className={styles['cards__limits-save-icon']} />
          {t('editLimits')}
        </button>
      )}
    </div>
  )
}
