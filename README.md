# Broadify - Jira Clone 

Broadify is a web application that allows you to manage your workspaces,projects and tasks.
## Table of Contents

- [Broadify - Jira Clone](#broadify---jira-clone)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Environment Variables](#environment-variables)
  - [Screens](#screens)
    - [Screen 1: Home](#screen-1-home)
    - [Screen 2: Dashboard](#screen-2-dashboard)
    - [Screen 3: Settings](#screen-3-settings)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

To install the project, clone the repository and run the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Usage

To start the development server, run:

```bash
npm start
```

## Environment Variables

The project requires the following environment variables to be set in a `.env.local` file:

- `NEXT_PUBLIC_APPWRITE_DATABASE_ID`: Your Appwrite database ID.
- `NEXT_PUBLIC_APPWRITE_WORKSPACES_ID`: Your Appwrite workspaces ID.
- `NEXT_PUBLIC_APPWRITE_STORAGE_IMAGE_BUCKET_ID`: Your Appwrite storage image bucket ID.
- `NEXT_PUBLIC_APPWRITE_MEMBERS_ID`: Your Appwrite members ID.
- `NEXT_PUBLIC_APPWRITE_PROJECTS_ID`: Your Appwrite projects ID.
- `NEXT_PUBLIC_APPWRITE_TASKS_ID`: Your Appwrite tasks ID.
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`: Your Appwrite endpoint.
- `NEXT_PUBLIC_APPWRITE_PROJECT`: Your Appwrite project ID.
- `NEXT_APPWRITE_KEY`: Your Appwrite API key.

## Screens

### Screen 1: Home

The home screen provides an overview of the application and its features.

### Screen 2: Dashboard

The dashboard screen allows users to manage their tasks, projects, and workspaces.

### Screen 3: Settings

The settings screen allows users to configure their account and application preferences.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
