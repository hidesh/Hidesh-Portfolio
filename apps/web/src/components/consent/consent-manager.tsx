'use client'

/**
 * Consent Manager
 * Orchestrates banner and modal
 */

import React from 'react'
import { ConsentBanner } from './consent-banner'
import { ConsentSettingsModal } from './consent-settings-modal'

export function ConsentManager() {
  return (
    <>
      <ConsentBanner />
      <ConsentSettingsModal />
    </>
  )
}
