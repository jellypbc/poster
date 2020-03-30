# == Schema Information
#
# Table name: projects
#
#  id           :bigint           not null, primary key
#  description  :text
#  munged_title :string
#  title        :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

require 'rails_helper'

RSpec.describe Project, type: :model do
  describe 'validations' do
    let(:project) { Project.new }

    before { project.stub :set_placeholder_slug }

    context 'munged_title attribute presence' do
      context 'munged_title is set' do
        before { project.munged_title = 'radical-new-maths' }

        it 'is valid' do
          expect(project).to be_valid
        end
      end

      context 'munged_title is nil' do
        before { project.munged_title = nil }

        it 'is not valid' do
          expect(project).to_not be_valid
        end
      end
    end

    context 'slug attribute uniqueness' do
      before { create :project, title: 'my project', munged_title: 'inspiring-new-methodology' }

      context 'munged_title is unique' do
        before { project.munged_title = 'munged-title' }

        it 'is valid' do
          expect(project).to be_valid
        end
      end

      context 'munged_title is not unique' do
        before { project.munged_title = 'inspiring-new-methodology' }

        it 'is not valid' do
          expect(project).to_not be_valid
        end
      end
    end

    context 'slug attribute blacklist' do
      context 'munged_title is on the blacklist' do
        before { project.munged_title = 'new' }

        it 'is not valid' do
          expect(project).to_not be_valid
        end
      end
    end
  end

  describe '#set_slug!' do
    context 'for a new project' do
      let(:project) { Project.new }

      it 'sets munged_title' do
        project.title = 'Shiny New Drug'

        expect {
          project.set_munged_title!
        }.to change { project.munged_title }.from(nil).to('shiny-new-drug')
      end
    end

    context 'for an existing project' do
      let(:project) { Project.new munged_title: 'wacky-old-theory' }

      it 'updates munged_title' do
        project.title = 'Staggering New Theory'

        expect {
          project.set_munged_title!
        }.to change { project.munged_title }
          .from(project.munged_title).to('staggering-new-theory')
      end
    end
  end

  describe 'save_munged_title_if_changed' do
    let!(:project) { create :project }
    it 'sets a new munged_title if the title has changed' do
      expect {
        project.update_attributes(title: "this is my new title")
      }.to change { project.munged_title }.to('this-is-my-new-title')
    end
  end
end
