# AI Agent Rules & Project Structure

Follow these rules strictly when working on this project.

## Package Manager

- **Yarn Only**: Always use `yarn` for installing packages, running scripts, and all other package management tasks. Do not use `npm`.

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

- **Functional Components**: Always use `function ComponentName(): React.ReactNode {}` instead of `const ComponentName = () => {}`. **Always declare the explicit return type.**
- **Named Exports**: Never use `export default` unless strictly necessary (e.g., for certain library requirements). Always use named exports: `export function ComponentName() { ... }`.
- **Icons**: Use `@react-native-vector-icons/material-design-icons` exclusively.
- **Safe Area**: Do not use `SafeAreaView` from `react-native` (it is deprecated). Always use `SafeAreaProvider` and `useSafeAreaInsets` (or `SafeAreaView` with `edges`) from `react-native-safe-area-context`.
- **Modals**: For components that function as modals, always end the name with `Modal` (e.g., `RepaymentModal`, `CoinTransactionModal`) instead of `Component`.

### Styling

- **Separation**: Never use inline `StyleSheet.create` in `.tsx` files. Move all styles to a co-located `*.styles.ts` file.
- **Color Codes**: Never hardcode hex codes or random colors in components or style files. Always import and use the tokens from `src/theme/colors.ts` to ensure theme consistency.
- **Idempotency**: All POST and PUT mutations involving financial transactions or critical data (e.g., money refill, payment, important settings) must include an `Idempotency-Key` in the request headers. This key should be a unique per-operation identifier (e.g., a UUID or timestamp-based key) generated on the client side to prevent duplicate processing on retries.

### Functions

- **Declaration**: Always use `function functionName() {}` instead of `const functionName = () => {}` for pure functions or utility helpers.

### API Definition (RTK Query)

- **Naming Convention**:
  - Request types: `<apiName>Request`
  - Response types: `<apiName>Response`
  - Example: `builder.query<GetUserRequest, GetUserResponse>(...)`
  - Always declare types in the separate `<apiGroupName>APIDataTypes.ts` file.
  - **Always use `type` instead of `interface` for all API-related definitions.**
  - **Discriminated Unions**: Use discriminated unions for API requests/responses that have conditional field requirements based on a type field (e.g., different amount keys for different wallet types).
- **No Implicit Any**: Never use the `any` type. Always define explicit types for variables, function parameters, and return types to ensure type safety.
- **RTK Query Naming Patterns**: When destructuring mutation or query hooks, always rename the states using the full operation name as a prefix to avoid collisions and improve clarity.
  - **Pattern**: `const { data: [operation]Data, isLoading: [operation]IsLoading, ... } = use[Operation]Query();`
  - **Example (Mutation)**: `const [login, { isLoading: loginIsLoading, isSuccess: loginIsSuccess, data: loginData, error: loginError }] = useLoginMutation();`
  - **Example (Query)**: `const { data: userData, isLoading: userIsLoading, isFetching: userIsFetching, error: userError } = useGetUserDataQuery();`
