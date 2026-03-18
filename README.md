# This Repo Is In Maintenance Mode

Please do not clone or otherwise use this repo! Vanilla Components is being sunset in favor of our new, improved component library, [Remarkable Pro](https://github.com/embeddable-hq/remarkable-pro-boilerplate). If you are an existing user and have questions about this transition, please reach out to Customer Success or your account manager. If you are a new user, please start with Remarkable Pro instead of Vanilla Components.

This repo will only receive updates between now and the end of Q3, 2026, when it will be fully archived, if there are significant bug fixes, or if the components need to be updated to work with changes in the Embeddable SDK or Platform.

---

# Embeddable.com Starter Pack

Hello and welcome to our Embeddable components **starter pack** built just for you by the Embeddable team ❤️ We wish to thank you for using our platform and welcome any feedback.

![example-dash](https://github.com/embeddable-hq/vanilla-components/assets/6795003/3f38f938-7848-4e25-8cc0-90160398f0a1)

### Installation

The easiest way to get started with this starter pack is to [follow the documentation](https://docs.embeddable.com/getting-started/download-starter-repo).

However, if you want to roll your own boilerplate, you can add these components with `npm i @embeddable.com/vanilla-components @embeddable.com/react @embeddable.com/core @embeddable.com/sdk-react @embeddable.com/sdk-core` (requires node 20 or later).

### Build & Deploy

This is how you push code changes to your Embeddable workspace

1.  Head to https://app.us.embeddable.com (or https://app.eu.embeddable.com) and grab your **API Key**.

2.  **Set your location**: in [embeddable.config.ts](./embeddable.config.ts), uncomment either the US or EU config section.

3.  **Build** the code bundle: `npm run embeddable:build`

4.  **Push** the above code bundle to your workspace:

`npm run embeddable:push -- --api-key <API Key> --email <Email> --message <Message>`

4.  Head back to https://app.embeddable.com (or https://app.eu.embeddable.com) and "Create new Embeddable" using the **components** and **models** from your code bundle

### Local Development

This is a "Preview workspace" (local to you) that allows you make changes locally and see them instantly without needing to "Build and Deploy".

`npm run embeddable:dev` (note: you may need to run `npm run embeddable:login` first)

It opens a "Preview" workspace, that uses your local components and models.
