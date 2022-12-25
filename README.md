# WordGames

Many short games using reactjs

## Project structure

    ├── src
    | |──assets
    │ │ ├── Assets should be in their respective category folder [src/assets/images, src/assets/fonts]
    │ ├── components
    │ │ ├── All components related to a specific game should have to be in that game folder [src/components/2048/:anyComponent]
    │ │ ├── Utility components
    │ ├── hooks
    │ │ ├── utility hooks
    │ │ ├── custom hooks with their respective game folder or category [src/hooks/2048]
    │ ├── layout
    │ │ ├── Webpage Layout [GameLayout][AuthenticationLayout]
    │ │ ├── Any Pages other than Game related [ErrorPage]
    │ ├── Routes
    │ │ ├── [index.tsx] Global route
    │ │ ├── [GameRoutes.tsx] Add the path and game component to this routerObject
    │ │ ├── [AuthenticationRoutes.tsx] Login and signup routes
    │ ├── utility
    │ │ ├── Global utility
    │ │ ├── Helper functions in their particular category should have a file
    │ ├── main.css  Tailwindcss entry point
    │ ├── main.tsx  Application entry point
    ├── tailwiind.config.cjs
    ├── public
    │ ├── same as assets under src
    ├── dist
    ├── node_modules
    ├── package.json
    ├── yarn.lock
    └── .gitignore
    ├── Rest files do not change
