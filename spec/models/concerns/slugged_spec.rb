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
      before { create :post, title: "Awesome Post", slug: 'inspir-awesome-post' }

      context 'slug is unique' do
        before { post.slug = 'munged-title' }

        it 'is valid' do
          expect(post).to be_valid
        end
      end

      context 'slug is not unique' do
        before { post.slug = 'inspir-awesome-post' }

        it 'is not valid' do
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

      it 'sets slug' do
        post.title = 'Shiny New Drug'

        expect { post.set_slug! }.to change { post.slug }
        expect(post.slug).to include('shiny-new-drug')
      end
    end

    context 'for an existing post' do
      let(:post) { Post.new slug: '12345-old-theory' }

      it 'updates slug' do
        post.title = 'Staggering New Theory'

        expect { post.set_slug! }.to change { post.slug }
        expect(post.slug).to include('staggering-new-theory')
      end
    end
  end
end
