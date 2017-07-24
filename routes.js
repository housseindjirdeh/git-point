/* eslint-disable react/prop-types */
import React from 'react';
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom,
  NavigationActions,
} from 'react-navigation';
import { Icon } from 'react-native-elements';

import { colors } from 'config';

// Auth
import {
  SplashScreen,
  LoginScreen,
  WelcomeScreen,
  AuthProfileScreen,
  EventsScreen,
} from 'auth';

// User
import {
  ProfileScreen,
  RepositoryListScreen,
  FollowerListScreen,
  FollowingListScreen,
} from 'user';

// Organization
import { OrganizationProfileScreen } from 'organization';

// Search
import { SearchScreen } from 'search';

// Notifications
import { NotificationsScreen } from 'notifications';

// Repository
import {
  RepositoryScreen,
  RepositoryCodeListScreen,
  RepositoryFileScreen,
  IssueListScreen,
  PullListScreen,
  PullDiffScreen,
  ReadMeScreen,
} from 'repository';

// Issue
import { IssueScreen, IssueSettingsScreen, PullMergeScreen } from 'issue';

const sharedRoutes = {
  RepositoryList: {
    screen: RepositoryListScreen,
    navigationOptions: {
      title: 'Repositories',
    },
  },
  FollowerList: {
    screen: FollowerListScreen,
    navigationOptions: {
      title: 'Followers',
    },
  },
  FollowingList: {
    screen: FollowingListScreen,
    navigationOptions: {
      title: 'Following',
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      header: null,
    },
  },
  Organization: {
    screen: OrganizationProfileScreen,
    navigationOptions: {
      header: null,
    },
  },
  Repository: {
    screen: RepositoryScreen,
    navigationOptions: {
      header: null,
    },
  },
  RepositoryCodeList: {
    screen: RepositoryCodeListScreen,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.topLevel
        ? 'Code'
        : navigation.state.params.content.name,
    }),
  },
  RepositoryFile: {
    screen: RepositoryFileScreen,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.content.name,
    }),
  },
  IssueList: {
    screen: IssueListScreen,
    navigationOptions: {
      title: 'Issues',
    },
  },
  PullList: {
    screen: PullListScreen,
    navigationOptions: {
      title: 'Pull Requests',
    },
  },
  Issue: {
    screen: IssueScreen,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.issue
        ? `#${navigation.state.params.issue.number}`
        : '',
    }),
  },
  IssueSettings: {
    screen: IssueSettingsScreen,
    navigationOptions: {
      title: 'Settings',
    },
  },
  PullDiff: {
    screen: PullDiffScreen,
    navigationOptions: {
      title: 'Diff',
    },
  },
  PullMerge: {
    screen: PullMergeScreen,
    navigationOptions: {
      title: 'Merge',
    },
  },
  ReadMe: {
    screen: ReadMeScreen,
    navigationOptions: {
      title: 'README.md',
    },
  },
};

const HomeStackNavigator = StackNavigator(
  {
    Events: {
      screen: EventsScreen,
      navigationOptions: {
        headerTitle: 'Events',
      },
    },
    ...sharedRoutes,
  },
  {
    headerMode: 'screen',
  }
);

const NotificationsStackNavigator = StackNavigator(
  {
    Notifications: {
      screen: NotificationsScreen,
      navigationOptions: {
        header: null,
      },
    },
    ...sharedRoutes,
  },
  {
    headerMode: 'screen',
  }
);

const SearchStackNavigator = StackNavigator(
  {
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        header: null,
      },
    },
    ...sharedRoutes,
  },
  {
    headerMode: 'screen',
  }
);

const MyProfileStackNavigator = StackNavigator(
  {
    MyProfile: {
      screen: AuthProfileScreen,
      navigationOptions: {
        header: null,
      },
    },
    ...sharedRoutes,
  },
  {
    headerMode: 'screen',
  }
);

const MainTabNavigator = TabNavigator(
  {
    Home: {
      screen: HomeStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) =>
          <Icon
            containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
            color={tintColor}
            name="home"
            size={33}
          />,
      },
    },
    Notifications: {
      screen: NotificationsStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) =>
          <Icon
            containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
            color={tintColor}
            name="notifications"
            size={33}
          />,
      },
    },
    Search: {
      screen: SearchStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) =>
          <Icon
            containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
            color={tintColor}
            name="search"
            size={33}
          />,
      },
    },
    MyProfile: {
      screen: MyProfileStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) =>
          <Icon
            containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
            color={tintColor}
            name="person"
            size={33}
          />,
      },
    },
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      showLabel: false,
      activeTintColor: colors.primaryDark,
      inactiveTintColor: colors.grey,
    },
    tabBarComponent: ({ jumpToIndex, ...props }) =>
      <TabBarBottom
        {...props}
        jumpToIndex={index => {
          const { dispatch, state } = props.navigation;

          if (state.index === index && state.routes[index].routes.length > 1) {
            const stackRouteName = [
              'Events',
              'Notifications',
              'Search',
              'MyProfile',
            ][index];

            dispatch(
              NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: stackRouteName }),
                ],
              })
            );
          } else {
            jumpToIndex(index);
          }
        }}
      />,
  }
);

export const GitPoint = StackNavigator(
  {
    Splash: {
      screen: SplashScreen,
      navigationOptions: {
        header: null,
      },
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null,
      },
    },
    Welcome: {
      screen: WelcomeScreen,
      navigationOptions: {
        header: null,
      },
      path: 'welcome',
    },
    Main: {
      screen: MainTabNavigator,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    headerMode: 'screen',
    URIPrefix: 'gitpoint://',
  }
);
