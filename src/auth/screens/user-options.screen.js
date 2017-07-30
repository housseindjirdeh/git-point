import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

import { ViewContainer, SectionList } from 'components';
import { colors, fonts } from 'config';
import { openURLInView, resetNavigationTo } from 'utils';
import { signOut, changeLanguage } from 'auth';

const mapStateToProps = state => ({
  language: state.auth.language,
});

const mapDispatchToProps = dispatch => ({
  signOutByDispatch: () => dispatch(signOut()),
  changeLanguageByDispatch: lang => dispatch(changeLanguage(lang)),
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
  logoutTitle: {
    color: colors.red,
    ...fonts.fontPrimary,
  },
});

class UserOptions extends Component {
  props: {
    language: string,
    changeLanguageByDispatch: () => void,
    signOutByDispatch: () => void,
    navigation: Object,
  };

  signOutUser() {
    const { signOutByDispatch, navigation } = this.props;

    signOutByDispatch().then(() => {
      const url = 'https://github.com/logout';

      openURLInView(url);
      resetNavigationTo('Login', navigation);
    });
  }

  render() {
    const { language, changeLanguageByDispatch, navigation } = this.props;

    return (
      <ViewContainer>
        <ScrollView>
          <SectionList title="LANGUAGE">
            <ListItem
              title="English"
              titleStyle={styles.listTitle}
              hideChevron={language !== 'en'}
              rightIcon={{ name: 'check' }}
              onPress={() => changeLanguageByDispatch('en')}
              underlayColor={colors.greyLight}
            />
            <ListItem
              title="French"
              titleStyle={styles.listTitle}
              hideChevron={language !== 'fr'}
              rightIcon={{ name: 'check' }}
              onPress={() => changeLanguageByDispatch('fr')}
              underlayColor={colors.greyLight}
            />
          </SectionList>

          <SectionList>
            <ListItem
              title="Privacy Policy"
              titleStyle={styles.listTitle}
              onPress={() => navigation.navigate('PrivacyPolicy')}
              underlayColor={colors.greyLight}
            />

            <ListItem
              title="Sign Out"
              titleStyle={styles.logoutTitle}
              hideChevron
              onPress={() => this.signOutUser()}
              underlayColor={colors.greyLight}
            />
          </SectionList>
        </ScrollView>
      </ViewContainer>
    );
  }
}

export const UserOptionsScreen = connect(mapStateToProps, mapDispatchToProps)(
  UserOptions
);
