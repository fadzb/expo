import React from 'react';
import { AppRegistry, StyleSheet } from 'react-native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { ThemeContext } from 'react-navigation';

import LocalStorage from '../storage/LocalStorage';
import DevMenuBottomSheet from './DevMenuBottomSheet';
import DevMenuView from './DevMenuView';

function useUserSettings(renderId): { preferredAppearance?: string } {
  const [settings, setSettings] = React.useState({});

  React.useEffect(() => {
    async function getUserSettings() {
      const settings = await LocalStorage.getSettingsAsync();
      setSettings(settings);
    }

    getUserSettings();
  }, [renderId]);

  return settings;
}

class DevMenuRoot extends React.PureComponent<any, any> {
  render() {
    return <DevMenuApp {...this.props} />;
  }
}

function DevMenuApp(props) {
  const colorScheme = useColorScheme();
  const { preferredAppearance = 'no-preference' } = useUserSettings(props.uuid);

  let theme = preferredAppearance === 'no-preference' ? colorScheme : preferredAppearance;
  if (theme === 'no-preference') {
    theme = 'light';
  }

  return (
    <AppearanceProvider style={styles.rootView}>
      <DevMenuBottomSheet uuid={props.uuid}>
        <ThemeContext.Provider value={theme}>
          <DevMenuView {...props} />
        </ThemeContext.Provider>
      </DevMenuBottomSheet>
    </AppearanceProvider>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
});

AppRegistry.registerComponent('HomeMenu', () => DevMenuRoot);
