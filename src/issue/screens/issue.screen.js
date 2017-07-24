import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Linking,
  Platform,
} from 'react-native';
import { Icon } from 'react-native-elements';

import {
  ViewContainer,
  LoadingContainer,
  IssueDescription,
  CommentListItem,
  CommentInput,
} from 'components';
import { colors } from 'config';
import { getRepository } from 'repository';
import {
  getIssueComments,
  postIssueComment,
  getIssueFromUrl,
} from '../issue.action';

const mapStateToProps = state => ({
  authUser: state.auth.user,
  repository: state.repository.repository,
  issue: state.issue.issue,
  diff: state.issue.diff,
  isMerged: state.issue.isMerged,
  comments: state.issue.comments,
  isPendingDiff: state.issue.isPendingDiff,
  isPendingCheckMerge: state.issue.isPendingCheckMerge,
  isPendingComments: state.issue.isPendingComments,
  isPostingComment: state.issue.isPostingComment,
  isPendingIssue: state.issue.isPendingIssue,
});

const mapDispatchToProps = dispatch => ({
  getIssueCommentsByDispatch: url => dispatch(getIssueComments(url)),
  postIssueCommentByDispatch: (body, owner, repoName, issueNum) =>
    dispatch(postIssueComment(body, owner, repoName, issueNum)),
  getIssueFromUrlByDispatch: url => dispatch(getIssueFromUrl(url)),
  getRepositoryByDispatch: url => dispatch(getRepository(url)),
});

class Issue extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state, navigate } = navigation;

    if (state.params.userHasPushPermission) {
      return {
        headerRight: (
          <Icon
            name="gear"
            color={colors.primaryDark}
            type="octicon"
            containerStyle={{ marginRight: 5 }}
            underlayColor={colors.transparent}
            onPress={() =>
              navigate('IssueSettings', {
                issue: state.params.issue,
              })}
          />
        ),
      };
    }

    return null;
  };

  props: {
    getIssueCommentsByDispatch: Function,
    getRepositoryByDispatch: Function,
    postIssueCommentByDispatch: Function,
    getIssueFromUrlByDispatch: Function,
    diff: string,
    issue: Object,
    isMerged: boolean,
    // authUser: Object,
    repository: Object,
    comments: Array,
    isPendingIssue: boolean,
    isPendingDiff: boolean,
    isPendingCheckMerge: boolean,
    isPendingComments: boolean,
    // isPostingComment: boolean,
    navigation: Object
  };

  componentDidMount() {
    const {
      issue,
      navigation,
      repository,
      getIssueCommentsByDispatch,
      getRepositoryByDispatch,
      getIssueFromUrlByDispatch,
    } = this.props;

    const issueParam = navigation.state.params.issue;
    const issueURLParam = navigation.state.params.issueURL;
    const issueCommentsURL = `${navigation.state.params.issueURL}/comments`;

    Promise.all(
      getIssueFromUrlByDispatch(issueURLParam || issueParam.url),
      getIssueCommentsByDispatch(issueURLParam ? issueCommentsURL : issueParam.comments_url)
    ).then(() => {
      if (
        repository.full_name !==
        issue.repository_url.replace('https://api.github.com/repos/', '')
      ) {
        getRepositoryByDispatch(issue.repository_url).then(() => {
          this.setNavigationParams();
        });
      } else {
        this.setNavigationParams();
      }
    });
  }

  onLinkPress = node => {
    const { navigation } = this.props;

    if (node.attribs.class && node.attribs.class.includes('user-mention')) {
      navigation.navigate('Profile', {
        user: { login: node.children[0].data.substring(1) },
      });
    } else if (
      node.attribs.class &&
      node.attribs.class.includes('issue-link')
    ) {
      navigation.navigate('Issue', {
        issueURL: node.attribs['data-url'].replace(
          'github.com',
          'api.github.com/repos'
        ),
      });
    } else {
      Linking.openURL(node.attribs.href);
    }
  };

  onRepositoryPress = url => {
    const { navigation } = this.props;

    navigation.navigate('Repository', {
      repositoryUrl: url,
    });
  };

  setNavigationParams = () => {
    const { navigation, issue, repository } = this.props;
    let params = null;

    if (navigation.state.params.issue) {
      params = {
        userHasPushPermission:
          repository.permissions.admin || repository.permissions.push,
      };
    } else {
      params = {
        userHasPushPermission:
          repository.permissions.admin || repository.permissions.push,
        issue,
      };
    }

    navigation.setParams(params);
  };

  postComment = body => {
    const { repository, navigation } = this.props;

    const repoName = repository.name;
    const owner = repository.owner.login;
    const issueNum = navigation.state.params.issue.number;

    this.props.postIssueCommentByDispatch(body, owner, repoName, issueNum);
    Keyboard.dismiss();
    this.commentsList.scrollToEnd();
  };

  keyExtractor = item => {
    return item.id;
  };

  renderHeader = () => {
    const {
      issue,
      diff,
      isMerged,
      isPendingDiff,
      isPendingCheckMerge,
      navigation,
    } = this.props;

    return (
      <IssueDescription
        issue={issue}
        diff={diff}
        isMerged={isMerged}
        isPendingDiff={isPendingDiff}
        isPendingCheckMerge={isPendingCheckMerge}
        onRepositoryPress={url => this.onRepositoryPress(url)}
        onLinkPress={node => this.onLinkPress(node)}
        userHasPushPermission={navigation.state.params.userHasPushPermission}
        navigation={navigation}
      />
    );
  };

  renderItem = ({ item }) =>
    <CommentListItem
      comment={item}
      onLinkPress={node => this.onLinkPress(node)}
      navigation={this.props.navigation}
    />;

  render() {
    const {
      issue,
      comments,
      isPendingComments,
      isPendingIssue,
      navigation,
    } = this.props;

    return (
      <ViewContainer>
        {(isPendingComments || isPendingIssue) &&
          <LoadingContainer
            animating={isPendingComments || isPendingIssue}
            center
          />}

        {!isPendingComments &&
          !isPendingIssue &&
          issue &&
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={'padding'}
            keyboardVerticalOffset={Platform.select({ ios: 65, android: -200 })}
          >
            <FlatList
              ref={ref => {
                this.commentsList = ref;
              }}
              contentContainerStyle={{ flexGrow: 1 }}
              ListHeaderComponent={this.renderHeader}
              removeClippedSubviews={false}
              data={[issue, ...comments]}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
            />

            <CommentInput
              userHasPushPermission={
                navigation.state.params.userHasPushPermission
              }
              issueLocked={issue.locked}
              onSubmitEditing={this.postComment}
            />
          </KeyboardAvoidingView>}
      </ViewContainer>
    );
  }
}

export const IssueScreen = connect(mapStateToProps, mapDispatchToProps)(Issue);
