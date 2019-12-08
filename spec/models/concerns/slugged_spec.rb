require 'rails_helper'

describe Slugged do
  # Tests tied to post model for now

  describe 'validations' do
    let(:post) { Post.new }

    before { post.stub :set_placeholder_slug }

    context 'slug attribute presence' do
      context 'slug is set' do
        before { post.slug = 'radical-new-maths' }

        it 'is valid' do
          expect(post).to be_valid
        end
      end

      context 'slug is nil' do
        before { post.slug = nil }

        it 'is not valid' do
          expect(post).to_not be_valid
        end
      end
    end

    context 'slug attribute uniqueness' do
      before { create :post, slug: 'inspiring-new-methodology' }

      context 'slug is unique' do
        before { post.slug = 'munged-title' }

        it 'is valid' do
          expect(post).to be_valid
        end
      end

      context 'slug is not unique' do
        before { post.slug = 'inspiring-new-methodology' }

        xit 'is not valid' do
          expect(post).to_not be_valid
        end
      end
    end

    context 'slug attribute blacklist' do
      context 'slug is on the blacklist' do
        before { post.slug = 'new' }

        it 'is not valid' do
          expect(post).to_not be_valid
        end
      end
    end
  end

  describe '#set_slug!' do
    context 'for a new post' do
      let(:post) { Post.new }

      xit 'sets slug' do
        post.title = 'Shiny New Drug'

        expect {
          post.set_slug!
        }.to change { post.slug }.from(nil).to('shiny-new-drug')
      end
    end

    context 'for an existing post' do
      let(:post) { Post.new slug: 'wacky-old-theory' }

      xit 'updates slug' do
        post.title = 'Staggering New Theory'

        expect {
          post.set_slug!
        }.to change { post.slug }
          .from(post.slug).to('staggering-new-theory')
      end
    end
  end
end
