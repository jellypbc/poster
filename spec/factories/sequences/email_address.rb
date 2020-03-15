FactoryBot.define do
  sequence :email_address do |n|
    "person#{n}@jellypbc.com"
  end
end
