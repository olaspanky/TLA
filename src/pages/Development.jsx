import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreateDevelopmentNeedMutation } from '../redux/slices/api/developmentApiSlice';
import { toast } from 'react-toastify';

const AddDevelopmentNeed = () => {
  const navigate = useNavigate();
  const [createDevelopmentNeed, { isLoading }] = useCreateDevelopmentNeedMutation();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false); // State for success banner

  const [formData, setFormData] = useState({
    needs: '',
    trainingObjective: '',
    trainingProvider: '',
    cost: '',
    budgetArea: '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExternalLink = (field) => {
    if (field === 'trainingProvider' && formData.trainingProvider) {
      const url = formData.trainingProvider.startsWith('http')
        ? formData.trainingProvider
        : `https://${formData.trainingProvider}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast.info('Please enter a valid training provider name or URL', {
        position: 'top-right',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.needs.trim() || !formData.budgetArea.trim()) {
      toast.error('Development Need and Budget Area cannot be empty', {
        position: 'top-right',
      });
      return;
    }
    if (formData.cost && Number(formData.cost) < 0) {
      toast.error('Cost cannot be negative', { position: 'top-right' });
      return;
    }

    try {
      // Prepare payload, excluding trainingObjective and trainingProvider
      const payload = {
        needs: formData.needs.trim(),
        cost: Number(formData.cost) || 0,
        budgetArea: formData.budgetArea.trim(),
      };

      const response = await createDevelopmentNeed(payload).unwrap();

      // Show success toast with customized message
      toast.success(`Development need "${formData.needs}" created successfully!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Show success banner
      setShowSuccessBanner(true);
      setTimeout(() => setShowSuccessBanner(false), 5000); // Hide banner after 5 seconds

      // Reset form
      setFormData({
        needs: '',
        trainingObjective: '',
        trainingProvider: '',
        cost: '',
        budgetArea: '',
      });

      // Navigate after a slight delay to show the success message
      setTimeout(() => navigate('/development'), 1000);
    } catch (error) {
      console.error('Failed to create development need:', error);
      toast.error(error?.data?.message || 'Failed to create development need', {
        position: 'top-right',
      });
    }
  };

  const handleAddDevelopmentNeed = () => {
    setFormData({
      needs: '',
      trainingObjective: '',
      trainingProvider: '',
      cost: '',
      budgetArea: '',
    });
    setShowSuccessBanner(false); // Hide banner if adding another need
    toast.info('Form cleared for new development need', {
      position: 'top-right',
    });
  };

  const handleBack = () => {
    setShowSuccessBanner(false); // Hide banner when going back
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 rounded-lg">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Add Development Need</h1>
        </div>

        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg">
            <p className="font-medium">
              Success! Your development need "{formData.needs}" has been created.
            </p>
            <p className="text-sm">You will be redirected to the development page shortly.</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Development Need */}
            <div>
              <label htmlFor="needs" className="block text-base font-medium text-gray-900 mb-4">
                Development Need
              </label>
              <div className="relative">
                <textarea
                  id="needs"
                  placeholder="Input development need"
                  value={formData.needs}
                  onChange={(e) => handleInputChange('needs', e.target.value)}
                  className='w-full min-h-[120px] p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500
                  required
                  aria-required="true" '
                />
                <button
                  type="button"
                  aria-label="Open development need reference"
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  onClick={() => handleExternalLink('needs')}
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Training Objective */}
            <div>
              <label htmlFor="trainingObjective" className="block text-base font-medium text-gray-900 mb-4">
                Training Objective
              </label>
              <div className="relative">
                <textarea
                  id="trainingObjective"
                  placeholder="Input objective"
                  value={formData.trainingObjective}
                  onChange={(e) => handleInputChange('trainingObjective', e.target.value)}
                  className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
                <button
                  type="button"
                  aria-label="Open training objective reference"
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  onClick={() => handleExternalLink('trainingObjective')}
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Note: Training Objective is not currently saved to the database.
              </p>
            </div>

            {/* Training Provider */}
            <div>
              <label htmlFor="trainingProvider" className="block text-base font-medium text-gray-900 mb-4">
                Training Provider
              </label>
              <div className="relative">
                <textarea
                  id="trainingProvider"
                  placeholder="Input training provider"
                  value={formData.trainingProvider}
                  onChange={(e) => handleInputChange('trainingProvider', e.target.value)}
                  className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
                <button
                  type="button"
                  aria-label="Open training provider website"
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  onClick={() => handleExternalLink('trainingProvider')}
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Note: Training Provider is not currently saved to the database.
              </p>
            </div>

            {/* Cost and Budget Area Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cost */}
              <div>
                <label htmlFor="cost" className="block text-base font-medium text-gray-900 mb-4">
                  Cost
                </label>
                <input
                  id="cost"
                  type="number"
                  placeholder="Input cost"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  min="0"
                  step="1"
                  aria-describedby="cost-description"
                />
                <p id="cost-description" className="text-sm text-gray-500 mt-1">
                  Enter the cost in your local currency (e.g., 150000).
                </p>
              </div>

              {/* Budget Area */}
              <div>
                <label htmlFor="budgetArea" className="block text-base font-medium text-gray-900 mb-4">
                  Budget Area
                </label>
                <input
                  id="budgetArea"
                  type="text"
                  placeholder="Input budget area"
                  value={formData.budgetArea}
                  onChange={(e) => handleInputChange('budgetArea', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Submit development need"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit'
                )}
              </button>
              <button
                type="button"
                onClick={handleAddDevelopmentNeed}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                aria-label="Clear form for another development need"
              >
                Add Another Need
              </button>
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                aria-label="Go back to previous page"
              >
                Back
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDevelopmentNeed;