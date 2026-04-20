'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Business types for Bangladesh
const BUSINESS_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'it-software', label: 'IT/Software Company' },
  { value: 'import-export', label: 'Import-Export Business' },
  { value: 'garments-rmg', label: 'Garments/RMG Factory' },
  { value: 'pharmaceutical', label: 'Pharmaceutical Company' },
  { value: 'clinic-hospital', label: 'Clinic/Hospital' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'travel-agency', label: 'Travel Agency' },
  { value: 'real-estate', label: 'Real Estate Company' },
  { value: 'manufacturing', label: 'Manufacturing Factory' },
  { value: 'agro-business', label: 'Agro Business' },
  { value: 'fish-export', label: 'Fish Export Business' },
  { value: 'retail-shop', label: 'Retail Shop' },
  { value: 'construction', label: 'Construction Company' },
  { value: 'ngo', label: 'NGO' },
]

const DIVISIONS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Mymensingh',
  'Rangpur',
]

// License map data (example for Restaurant)
const LICENSE_MAP: Record<string, Array<{
  name_en: string
  name_bn: string
  issuing_authority: string
  renewal_cycle: string
  estimated_fee_bdt: [number, number]
}>> = {
  restaurant: [
    { name_en: 'Trade License', name_bn: 'ট্রেড লাইসেন্স', issuing_authority: 'City Corporation', renewal_cycle: 'Annual', estimated_fee_bdt: [5000, 10000] },
    { name_en: 'TIN Certificate', name_bn: 'টিআইএন সার্টিফিকেট', issuing_authority: 'NBR', renewal_cycle: 'One-time', estimated_fee_bdt: [0, 0] },
    { name_en: 'Fire Safety License', name_bn: 'ফায়ার সেফটি লাইসেন্স', issuing_authority: 'Fire Service', renewal_cycle: 'Annual', estimated_fee_bdt: [10000, 20000] },
    { name_en: 'Food Safety License', name_bn: 'খাদ্য নিরাপত্তা লাইসেন্স', issuing_authority: 'BSTI', renewal_cycle: 'Annual', estimated_fee_bdt: [8000, 15000] },
    { name_en: 'Health Certificate', name_bn: 'স্বাস্থ্য সনদ', issuing_authority: 'City Corporation', renewal_cycle: 'Annual', estimated_fee_bdt: [3000, 5000] },
    { name_en: 'Environment Clearance', name_bn: 'পরিবেশ ছাড়পত্র', issuing_authority: 'DoE', renewal_cycle: 'Annual', estimated_fee_bdt: [5000, 10000] },
    { name_en: 'Music License', name_bn: 'সঙ্গীত লাইসেন্স', issuing_authority: 'City Corporation', renewal_cycle: 'Annual', estimated_fee_bdt: [5000, 10000] },
    { name_en: 'Signboard License', name_bn: 'সাইনবোর্ড লাইসেন্স', issuing_authority: 'City Corporation', renewal_cycle: 'Annual', estimated_fee_bdt: [2000, 5000] },
  ],
}

type FormData = {
  business_name: string
  business_type: string
  location_division: string
  location_district: string
  ownership_type: 'local' | 'foreign' | 'joint_venture'
  email_notifications: boolean
  sms_notifications: boolean
  preferred_language: 'en' | 'bn'
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingLicenses, setIsGeneratingLicenses] = useState(false)
  const [licenses, setLicenses] = useState<Array<{
    name_en: string
    name_bn: string
    issuing_authority: string
    renewal_cycle: string
    estimated_fee_bdt: [number, number]
  }> | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    business_name: '',
    business_type: '',
    location_division: '',
    location_district: '',
    ownership_type: 'local',
    email_notifications: true,
    sms_notifications: false,
    preferred_language: 'en',
  })

  const handleNext = async () => {
    if (step === 1) {
      // Validate step 1
      if (!formData.business_name || !formData.business_type || !formData.location_division || !formData.location_district) {
        alert('Please fill in all fields')
        return
      }
      
      // Move to step 2 and generate licenses
      setStep(2)
      setIsGeneratingLicenses(true)
      
      // Simulate API call to generate license map
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const businessLicenses = LICENSE_MAP[formData.business_type] || LICENSE_MAP.restaurant
      setLicenses(businessLicenses)
      setIsGeneratingLicenses(false)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      // Save all data to Supabase
      await saveOnboardingData()
    }
  }

  const saveOnboardingData = async () => {
    setIsLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create business record
      const { data: business, error: businessError } = await supabase.from('businesses').insert({
        user_id: user.id,
        business_name: formData.business_name,
        business_type: formData.business_type,
        location_division: formData.location_division,
        location_district: formData.location_district,
        ownership_type: formData.ownership_type,
      }).select().single()

      if (businessError) throw businessError

      // Create license tracking records
      if (licenses) {
        const licenseRecords = licenses.map(license => ({
          business_id: business.id,
          license_slug: formData.business_type,
          license_name_en: license.name_en,
          license_name_bn: license.name_bn,
          issuing_authority: license.issuing_authority,
          status: 'pending' as const,
        }))

        const { error: licensesError } = await supabase.from('license_tracking').insert(licenseRecords)
        if (licensesError) throw licensesError
      }

      // Update user preferences
      const { error: userError } = await supabase.from('users').update({
        preferred_language: formData.preferred_language,
        notification_prefs: {
          email: formData.email_notifications,
          sms: formData.sms_notifications,
          whatsapp: false,
          push: true,
        },
      }).eq('id', user.id)

      if (userError) throw userError

      router.push('/dashboard')
    } catch (error: any) {
      alert(error.message || 'An error occurred')
      setIsLoading(false)
    }
  }

  const totalEstimatedFee = licenses 
    ? licenses.reduce((acc, lic) => acc + lic.estimated_fee_bdt[1], 0)
    : 0

  const minEstimatedFee = licenses
    ? licenses.reduce((acc, lic) => acc + lic.estimated_fee_bdt[0], 0)
    : 0

  return (
    <div className="min-h-screen bg-light-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center">
              <span className="text-green text-2xl font-bold">L</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate">
            Welcome to licensing.bd
          </h1>
          <p className="mt-2 text-sm text-slate/70">
            Powered by Tuhin & Partners
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate">Step {step} of 3</span>
            <span className="text-sm text-slate/70">
              {step === 1 && 'Business Profile'}
              {step === 2 && 'License Map'}
              {step === 3 && 'Notifications'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Business Profile */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate mb-6">Business Profile</h2>
            
            <div className="space-y-4">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-slate mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green focus:border-green"
                  placeholder="Enter your business name"
                />
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-sm font-medium text-slate mb-1">
                  Business Type
                </label>
                <select
                  value={formData.business_type}
                  onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green focus:border-green"
                >
                  <option value="">Select business type</option>
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Division */}
              <div>
                <label className="block text-sm font-medium text-slate mb-1">
                  Location Division
                </label>
                <select
                  value={formData.location_division}
                  onChange={(e) => setFormData({ ...formData, location_division: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green focus:border-green"
                >
                  <option value="">Select division</option>
                  {DIVISIONS.map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location District */}
              <div>
                <label className="block text-sm font-medium text-slate mb-1">
                  Location District
                </label>
                <input
                  type="text"
                  value={formData.location_district}
                  onChange={(e) => setFormData({ ...formData, location_district: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green focus:border-green"
                  placeholder="Enter district name"
                />
              </div>

              {/* Ownership Type */}
              <div>
                <label className="block text-sm font-medium text-slate mb-1">
                  Ownership Type
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="ownership_type"
                      value="local"
                      checked={formData.ownership_type === 'local'}
                      onChange={(e) => setFormData({ ...formData, ownership_type: e.target.value as 'local' | 'foreign' | 'joint_venture' })}
                      className="h-4 w-4 text-green focus:ring-green"
                    />
                    <span className="ml-2 text-slate">Local</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="ownership_type"
                      value="foreign"
                      checked={formData.ownership_type === 'foreign'}
                      onChange={(e) => setFormData({ ...formData, ownership_type: e.target.value as 'local' | 'foreign' | 'joint_venture' })}
                      className="h-4 w-4 text-green focus:ring-green"
                    />
                    <span className="ml-2 text-slate">Foreign</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="ownership_type"
                      value="joint_venture"
                      checked={formData.ownership_type === 'joint_venture'}
                      onChange={(e) => setFormData({ ...formData, ownership_type: e.target.value as 'local' | 'foreign' | 'joint_venture' })}
                      className="h-4 w-4 text-green focus:ring-green"
                    />
                    <span className="ml-2 text-slate">Joint Venture</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: License Map */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate mb-6">Your Compliance Map</h2>
            
            {isGeneratingLicenses ? (
              <div className="text-center py-12">
                <svg className="animate-spin h-12 w-12 text-green mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-slate font-medium">Generating your compliance map...</p>
                <p className="text-sm text-slate/70 mt-2">Analyzing requirements for {BUSINESS_TYPES.find(t => t.value === formData.business_type)?.label}</p>
              </div>
            ) : licenses ? (
              <div>
                <div className="mb-6 p-4 bg-light-gray rounded-lg">
                  <p className="text-slate font-medium">
                    {licenses.length} licenses identified | Est. BDT {minEstimatedFee.toLocaleString()}–{totalEstimatedFee.toLocaleString()}/year
                  </p>
                </div>
                
                <div className="space-y-3">
                  {licenses.map((license, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-light-gray transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-green rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-slate">{license.name_en}</p>
                          <p className="text-sm text-slate/70">{license.issuing_authority} • {license.renewal_cycle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate/70">BDT {license.estimated_fee_bdt[0].toLocaleString()}–{license.estimated_fee_bdt[1].toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Step 3: Notification Setup */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate mb-6">Notification Preferences</h2>
            
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate">Email Notifications</p>
                  <p className="text-sm text-slate/70">Receive renewal reminders and compliance updates via email</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, email_notifications: !formData.email_notifications })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.email_notifications ? 'bg-green' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.email_notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate">SMS Notifications</p>
                  <p className="text-sm text-slate/70">Get instant alerts on your mobile phone</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setFormData({ ...formData, sms_notifications: !formData.sms_notifications })}
                      disabled
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-not-allowed"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                    </button>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-navy text-white rounded">Professional plan</span>
                </div>
              </div>

              {/* Preferred Language */}
              <div>
                <p className="font-medium text-slate mb-3">Preferred Language</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormData({ ...formData, preferred_language: 'en' })}
                    className={`flex-1 py-3 px-4 rounded-md border-2 transition-colors ${
                      formData.preferred_language === 'en'
                        ? 'border-green bg-green/10 text-green'
                        : 'border-gray-200 text-slate hover:border-gray-300'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, preferred_language: 'bn' })}
                    className={`flex-1 py-3 px-4 rounded-md border-2 transition-colors ${
                      formData.preferred_language === 'bn'
                        ? 'border-green bg-green/10 text-green'
                        : 'border-gray-200 text-slate hover:border-gray-300'
                    }`}
                  >
                    বাংলা
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-gray-300 rounded-md text-slate font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          
          <button
            onClick={handleNext}
            disabled={isLoading || isGeneratingLicenses}
            className="px-8 py-3 bg-green text-white rounded-md font-medium hover:bg-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : step === 2 ? (
              'ADD ALL TO MY DASHBOARD'
            ) : step === 3 ? (
              'GO TO MY DASHBOARD'
            ) : (
              'CONTINUE'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
