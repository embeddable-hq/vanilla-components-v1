import { defineConfig } from '@embeddable.com/sdk-core';
import react from '@embeddable.com/sdk-react';

export default defineConfig({
  plugins: [react],
  lifecycleHooksFile: './lifecycle.config.ts',

  /*
   * uncomment for EU deployments
   */
  region: 'EU',

  /*
   * uncomment for US deployments
   */
  // region: 'US',

  /*
   * Uncomment use ALL vanilla components.
   */
  // componentLibraries: ['@embeddable.com/vanilla-components'],

  //For internal use only (this helps us help you debug issues)
  //
  // previewBaseUrl: 'https://app.dev.embeddable.com',
  // pushBaseUrl: 'https://api.dev.embeddable.com',
  // audienceUrl: 'https://api.dev.embeddable.com/',
  // authDomain: 'embeddable-dev.eu.auth0.com',
  // authClientId: 'xOKco5ztFCpWn54bJbFkAcT8mV4LLcpG',
});
