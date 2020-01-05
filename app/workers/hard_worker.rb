class HardWorker
  include Sidekiq::Worker

  def perform(text = "hello world")
    puts text
  end
end