import { NativeModules } from 'react-native';

jest.mock(
  '../apollos-ui-kit/node_modules/react-native-safe-area-context/',
  () => ({
    SafeAreaConsumer: ({ children }) =>
      children({ top: 0, bottom: 0, left: 0, right: 0 }),
    SafeAreaProvider: ({ children }) => children,
  })
);

jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsProvider: ({ children }) => children,
}));

NativeModules.RNGestureHandlerModule = {};

jest.mock(
  '../apollos-ui-kit/node_modules/@react-native-community/datetimepicker',
  () => 'DatePicker'
);
