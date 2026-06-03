import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';

import { cardBorder, colors, radius, spacing } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import {
  IconBarChart,
  IconFlash,
  IconGear,
  IconList,
  IconPlus,
} from '../components/Icons';
import { CreateScreen } from '../screens/CreateScreen';
import { ManageScreen } from '../screens/ManageScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { TodayScreen } from '../screens/TodayScreen';

export type RootTabParamList = {
  Today: undefined;
  Manage: undefined;
  Create: undefined;
  Stats: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    border: cardBorder,
    primary: colors.accent,
    text: colors.text,
  },
};

const TAB_LABEL_KEY: Record<keyof RootTabParamList, string> = {
  Today: 'tabs.today',
  Manage: 'tabs.manage',
  Create: 'tabs.create',
  Stats: 'tabs.stats',
  Settings: 'tabs.settings',
};

function TabIcon({
  name,
  focused,
}: {
  name: keyof RootTabParamList;
  focused: boolean;
}) {
  const stroke = focused ? colors.accent : colors.textSecondary;
  const size = 22;
  if (name === 'Today') return <IconFlash size={size} stroke={stroke} />;
  if (name === 'Manage') return <IconList size={size} stroke={stroke} />;
  if (name === 'Create') return <IconPlus size={size} stroke={stroke} />;
  if (name === 'Stats') return <IconBarChart size={size} stroke={stroke} />;
  return <IconGear size={size} stroke={stroke} />;
}

export function AppNavigator() {
  const { t } = useTranslation();

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const label = t(TAB_LABEL_KEY[route.name]);
          return {
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <View style={[styles.tabItem, focused && styles.tabItemActive]}>
                <TabIcon name={route.name} focused={focused} />
                <Text style={[styles.label, focused && styles.labelActive]}>
                  {label}
                </Text>
              </View>
            ),
          };
        }}
      >
        <Tab.Screen name="Today" component={TodayScreen} />
        <Tab.Screen name="Manage" component={ManageScreen} />
        <Tab.Screen name="Create" component={CreateScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: cardBorder,
    height: 70,
    paddingTop: 8,
    paddingBottom: 8,
    elevation: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    minWidth: 56,
    gap: 4,
  },
  tabItemActive: {
    backgroundColor: colors.accentSoft,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.accent,
    fontWeight: '600',
  },
});
