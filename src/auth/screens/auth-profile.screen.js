import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import codePush from 'react-native-code-push';
import I18n from 'locale';

import {
  ViewContainer,
  UserProfile,
  SectionList,
  LoadingContainer,
  ParallaxScroll,
  UserListItem,
  EntityInfo,
} from 'components';
import { colors, fonts, normalize } from 'config';
import { getUser, getOrgs, signOut } from 'auth';
import { emojifyText, openURLInView } from 'utils';
import { version } from 'package.json';

const mapStateToProps = state => ({
  user: state.auth.user,
  orgs: state.auth.orgs,
  language: state.auth.language,
  isPendingUser: state.auth.isPendingUser,
  isPendingOrgs: state.auth.isPendingOrgs,
});

const mapDispatchToProps = dispatch => ({
  getUserByDispatch: () => dispatch(getUser()),
  getOrgsByDispatch: () => dispatch(getOrgs()),
  signOutByDispatch: () => dispatch(signOut()),
});

const styles = StyleSheet.create({
  listTitle: {
    color: colors.black,
    ...fonts.fontPrimary,
  },
  listSubTitle: {
    color: colors.greyDark,
    ...fonts.fontPrimary,
  },
  update: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 40,
  },
  updateText: {
    color: colors.greyDark,
    ...fonts.fontPrimary,
  },
  updateTextSub: {
    fontSize: normalize(11),
  },
  note: {
    fontSize: normalize(11),
    color: colors.primaryDark,
    ...fonts.fontPrimaryLight,
    textAlign: 'center',
    padding: 10,
  },
  noteLink: {
    ...fonts.fontPrimarySemiBold,
  },
});

const updateText = {
  check: 'Check for update',
  checking: 'Checking for update...',
  updated: 'App is up to date',
  available: 'Update is available!',
  notApplicable: 'Not applicable in debug mode',
};

class AuthProfile extends Component {
  props: {
    getUserByDispatch: Function,
    getOrgsByDispatch: Function,
    user: Object,
    orgs: Array,
    language: string,
    isPendingUser: boolean,
    isPendingOrgs: boolean,
    navigation: Object,
  };

  state = {
    updateText: updateText.check,
  };

  componentDidMount() {
    this.props.getUserByDispatch();
    this.props.getOrgsByDispatch();
  }

  checkForUpdate = () => {
    if (__DEV__) {
      this.setState({ updateText: updateText.notApplicable });
    } else {
      this.setState({ updateText: updateText.checking });
      codePush
        .sync({
          updateDialog: true,
          installMode: codePush.InstallMode.IMMEDIATE,
        })
        .then(update => {
          this.setState({
            updateText: update ? updateText.available : updateText.updated,
          });
        });
    }
  };

  render() {
    const {
      user,
      orgs,
      isPendingUser,
      isPendingOrgs,
      language,
      navigation,
    } = this.props;
    const loading = isPendingUser || isPendingOrgs;

    return (
      <ViewContainer>
        {loading && <LoadingContainer animating={loading} center />}

        {!loading &&
          <ParallaxScroll
            renderContent={() =>
              <UserProfile
                type="user"
                initialUser={user}
                user={user}
                navigation={navigation}
              />}
            stickyTitle={user.login}
            showMenu
            menuIcon="gear"
            menuAction={() => navigation.navigate('UserOptions')}
          >
            {user.bio &&
              user.bio !== '' &&
              <SectionList title="BIO">
                <ListItem
                  subtitle={emojifyText(user.bio)}
                  subtitleStyle={styles.listSubTitle}
                  hideChevron
                />
              </SectionList>}

            <EntityInfo entity={user} orgs={orgs} navigation={navigation} />

            <SectionList
              title={I18n.t('greeting', { locale: language })}
              noItems={orgs.length === 0}
              noItemsMessage={'No organizations'}
            >
              {orgs.map(item =>
                <UserListItem
                  key={item.id}
                  user={item}
                  navigation={navigation}
                />
              )}
              <Text style={styles.note}>
                Can&apos;t see all your organizations?{'\n'}
                <Text
                  style={styles.noteLink}
                  onPress={() =>
                    openURLInView('https://github.com/settings/applications')}
                >
                  You may have to request approval for them.
                </Text>
              </Text>
            </SectionList>

            <TouchableOpacity
              style={styles.update}
              onPress={this.checkForUpdate}
            >
              <Text style={styles.updateText}>
                GitPoint v{version}
              </Text>
              <Text style={[styles.updateText, styles.updateTextSub]}>
                {this.state.updateText}
              </Text>
            </TouchableOpacity>
          </ParallaxScroll>}
      </ViewContainer>
    );
  }
}

export const AuthProfileScreen = connect(mapStateToProps, mapDispatchToProps)(
  AuthProfile
);
