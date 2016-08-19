class StoryObserver < ActiveRecord::Observer
  include ActionController::UrlFor
  include Rails.application.routes.url_helpers

  # Create a new changeset whenever the story is changed
  def after_save(story)
    if story.state_changed?
      notifier = nil
      unless story.project.suppress_notifications
        story_link = "#{story.base_uri}#story-#{story.id}"

        # Send a 'the story has been delivered' notification if the state has
        # changed to 'delivered'
        # FIXME Move to predicate on Story
        if story.state == 'started'
          if story.acting_user && story.requested_by && story.requested_by.email_delivery? && story.acting_user != story.requested_by
            notifier = Notifications.started(story, story.acting_user)
            notifier.deliver if notifier
          end
          IntegrationWorker.perform_async(story.project.id, "[#{story.project.name}] The story ['#{story.title}'](#{story_link}) has been started.")
        end

        if story.state == 'delivered'
          if story.acting_user && story.requested_by && story.requested_by.email_delivery? && story.acting_user != story.requested_by
            notifier = Notifications.delivered(story, story.acting_user)
            notifier.deliver if notifier
          end
          IntegrationWorker.perform_async(story.project.id, "[#{story.project.name}] The story ['#{story.title}'](#{story_link}) has been delivered for acceptance.")
        end

        # Send 'story accepted' email if state changed to 'accepted'
        if story.state == 'accepted'
          if story.acting_user && story.owned_by && story.owned_by.email_acceptance? && story.owned_by != story.acting_user
            notifier = Notifications.accepted(story, story.acting_user)
            notifier.deliver if notifier
          end
          IntegrationWorker.perform_async(story.project.id, "[#{story.project.name}] #{story.acting_user.name} ACCEPTED your story ['#{story.title}'](#{story_link}).")
        end

        # Send 'story rejected' email if state changed to 'rejected'
        if story.state == 'rejected'
          if story.acting_user && story.owned_by && story.owned_by.email_rejection? && story.owned_by != story.acting_user
            notifier = Notifications.rejected(story, story.acting_user)
            notifier.deliver if notifier
          end
          IntegrationWorker.perform_async(story.project.id, "[#{story.project.name}] #{story.acting_user.name} REJECTED your story ['#{story.title}'](#{story_link}).")
        end

      end

      # Set the project start date to today if the project start date is nil
      # and the state is changing to any state other than 'unstarted' or
      # 'unscheduled'
      # FIXME Make model method on Story
      if story.project && !story.project.start_date && !['unstarted', 'unscheduled'].include?(story.state)
        story.project.update_attribute :start_date, Date.today
      end
    end

    # If a story's 'accepted at' date is prior to the project start date,
    # the project start date should be moved back accordingly
    if story.accepted_at_changed? && story.accepted_at && story.accepted_at < story.project.start_date
      story.project.update_attribute :start_date, story.accepted_at
    end

  end
end
