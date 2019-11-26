import React from "react";
import { connect } from "react-redux";
import { fetchProjectBoard, toggleColumn } from "actions/projectBoard";
import { fetchPastStories } from "actions/pastIterations";
import Column from "../Columns/ColumnItem";
import Stories from "../stories/Stories";
import Sprints from "../stories/Sprints";
import History from "../stories/History";
import { getColumns } from "../../selectors/columns";
import * as ColumnModel from '../../models/beta/column';
import { createStory, closeHistory } from '../../actions/story';
import AddStoryButton from '../story/AddStoryButton';
import * as Story from 'libs/beta/constants';
import PropTypes from 'prop-types';
import { storyPropTypesShape } from '../../models/beta/story';
import { projectBoardPropTypesShape } from '../../models/beta/projectBoard';
import Notifications from '../Notifications';
import { removeNotification } from '../../actions/notifications';
import Sidebar from './Sidebar';
import { getVisibleColumnsSelector } from '../../selectors/projectBoard'


class ProjectBoard extends React.Component {
  componentWillMount() {
    this.props.fetchProjectBoard(this.props.projectId);
  }

  render() {
    if (!this.props.projectBoard.isFetched) {
      return <b>Loading</b>;
    }

    const {
      createStory,
      closeHistory,
      notifications,
      removeNotification,
      history,
      toggleColumn,
      visibleColumns
    } = this.props;

    return (
      <div className="ProjectBoard">
        <Notifications
          notifications={notifications}
          onRemove={removeNotification}
        />

        <Sidebar onToggleColumn={toggleColumn} visibleColumns={visibleColumns} />

        <Column title={I18n.t("projects.show.chilly_bin")}
          renderAction={() =>
            <AddStoryButton
              onAdd={() => createStory({
                state: Story.status.UNSCHEDULED
              })}
            />
          }
          isVisible={visibleColumns[ColumnModel.CHILLY_BIN]}
          canClose={ColumnModel.canClose(visibleColumns)}
          onClose={() => toggleColumn(ColumnModel.CHILLY_BIN)}
        >
          <Stories stories={this.props.chillyBinStories} />
        </Column>

        <Column
          title={`${I18n.t("projects.show.backlog")} /
          ${I18n.t("projects.show.in_progress")}`}
          renderAction={() =>
            <AddStoryButton
              onAdd={() => createStory({
                state: Story.status.UNSTARTED
              })}
            />
          }
          isVisible={visibleColumns[ColumnModel.BACKLOG]}
          canClose={ColumnModel.canClose(visibleColumns)}
          onClose={() => toggleColumn(ColumnModel.BACKLOG)}
        >
          <Sprints
            sprints={this.props.backlogSprints}
          />
        </Column>

        <Column
          title={I18n.t("projects.show.done")}
          isVisible={visibleColumns[ColumnModel.DONE]}
          canClose={ColumnModel.canClose(visibleColumns)}
          onClose={() => toggleColumn(ColumnModel.DONE)}
        >
          <Sprints
            sprints={this.props.doneSprints}
            fetchStories={this.props.fetchPastStories}
          />
        </Column>

        {
          history.status !== 'DISABLED' &&
          <Column
            onClose={closeHistory}
            title={[I18n.t("projects.show.history"), "'", history.storyTitle, "'"].join(' ')}
          >
            { history.status === 'LOADED'
              ? <History history={history.activities} />
              : <div className="loading">Loading...</div>
            }
          </Column>
        }
      </div>
    );
  }
}

ProjectBoard.propTypes = {
  projectBoard: projectBoardPropTypesShape.isRequired,
  chillyBinStories: PropTypes.arrayOf(storyPropTypesShape),
  doneSprints: PropTypes.array.isRequired,
  backlogSprints: PropTypes.array.isRequired,
  fetchProjectBoard: PropTypes.func.isRequired,
  createStory: PropTypes.func.isRequired,
  closeHistory: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
}

const mapStateToProps = ({
  projectBoard,
  project,
  stories,
  history,
  pastIterations,
  notifications
}) => ({
  projectBoard,
  history,
  chillyBinStories: getColumns({
    column: ColumnModel.CHILLY_BIN,
    stories
  }),
  backlogSprints: getColumns({
    column: ColumnModel.BACKLOG,
    stories,
    project,
    pastIterations
  }),
  doneSprints: getColumns({
    column: ColumnModel.DONE,
    pastIterations,
    stories
  }),
  notifications,
  visibleColumns: getVisibleColumnsSelector(projectBoard),
});

const mapDispatchToProps = {
  fetchProjectBoard,
  createStory,
  closeHistory,
  fetchPastStories,
  removeNotification,
  toggleColumn
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectBoard);
