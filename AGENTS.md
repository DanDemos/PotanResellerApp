# AI Agent Rules & Project Structure

Follow these rules strictly when working on this project.

## Project Structure

### Screens

- **Location**: `src/screens/<ScreenName>/`
- **Files**:
  - `<ScreenName>.tsx`: The component logic and UI.
  - `<ScreenName>.styles.ts`: The `StyleSheet.create({})` definitions. **Styles must always be separated.**

### API & Services

- **Location**: `src/api/actions/<Domain>/` (e.g., `src/api/actions/auth/`)
- **Files**:
  - `<apiGroupName>Api.ts`: The RTK Query service definition.
  - `<apiGroupName>APIDataTypes.ts`: The Request/Response type definitions.

### State Management (Redux)

- **Location**: `src/redux/` (e.g., `src/redux/store.ts`, `src/redux/slices/`)

## Coding Standards

### Components

- **Functional Components**: Always use `function ComponentName() {}` instead of `const ComponentName = () => {}`.
- **Icons**: Use `@react-native-vector-icons/material-design-icons` exclusively.
- **Safe Area**: Do not use `SafeAreaView` from `react-native` (it is deprecated). Always use `SafeAreaProvider` and `useSafeAreaInsets` (or `SafeAreaView` with `edges`) from `react-native-safe-area-context`.

### Styling

- **Separation**: Never use inline `StyleSheet.create` in `.tsx` files. Move all styles to a co-located `*.styles.ts` file.
- **Color Codes**: Never hardcode hex codes or random colors in components or style files. Always import and use the tokens from `src/theme/colors.ts` to ensure theme consistency.

### API Definition (RTK Query)

- **Naming Convention**:
  - Request types: `<apiName>Request`
  - Response types: `<apiName>Response`
  - Example: `builder.query<GetUserRequest, GetUserResponse>(...)`
  - Always declare types in the separate `<apiGroupName>APIDataTypes.ts` file.
  - **Always use `type` instead of `interface` for all API-related definitions.**
