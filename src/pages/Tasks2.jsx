import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { ChevronDown, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import { useCreateObjectiveMutation } from '../redux/slices/api/objectiveApiSlice';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AddObjectivesForm = () => {
  const { user } = useSelector((state) => state.auth); // Get authenticated user
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priorityLevel: '',
      startDate: '',
      endDate: '',
      subObjectives: [{ title: '', description: '' }],
    },
  });

  // Manage subObjectives as a dynamic array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subObjectives',
  });

  const [createObjective, { isLoading, isError, error, isSuccess }] =
    useCreateObjectiveMutation();

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Please log in to create an objective.');
      navigate('/log-in', { state: { from: location } });
      return;
    }

    try {
      // Format payload to match schema
      const objectiveData = {
        title: data.title,
        description: data.description,
        priorityLevel: data.priorityLevel,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        subObjectives: data.subObjectives
          .filter((sub) => sub.title.trim() !== '')
          .map((sub) => ({
            title: sub.title,
            description: sub.description || '',
          })),
      };

      const response = await createObjective(objectiveData).unwrap();
      toast.success('Objective created successfully!');
      reset();
    } catch (err) {
      const errorMessages = err?.data?.errors?.join(', ') || err?.data?.message || 'Failed to create objective';
      toast.error(errorMessages);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 rounded-lg">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Add Objective</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Objective Title */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-4">
              Objective Title
            </label>
            <div className="relative">
              <textarea
                placeholder="Enter objective title (e.g., Complete project documentation)"
                {...register('title', { required: 'Title is required' })}
                className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
              <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <ExternalLink className="w-5 h-5" />
              </button>
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
          </div>

          {/* Objective Description */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-4">
              Objective Description
            </label>
            <div className="relative">
              <textarea
                placeholder="Enter objective description (e.g., Finalize all API documentation)"
                {...register('description', {
                  required: 'Description is required',
                  validate: (value) => typeof value === 'string' || 'Description must be a string',
                })}
                className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
              <button type="button" className="absolute bottom-4 right-4 text-gray-400 hover:text-gray-600">
                <ExternalLink className="w-5 h-5" />
              </button>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Sub-Objectives */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-4">
              Sub-Objectives
            </label>
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="space-y-4">
                  {/* Sub-Objective Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub-Objective Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter sub-objective title (e.g., Build Frontend)"
                      {...register(`subObjectives.${index}.title`, {
                        required: 'Sub-objective title is required',
                      })}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.subObjectives?.[index]?.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subObjectives[index].title.message}
                      </p>
                    )}
                  </div>

                  {/* Sub-Objective Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub-Objective Description (Optional)
                    </label>
                    <textarea
                      placeholder="Enter sub-objective description (e.g., Create React Native UI components)"
                      {...register(`subObjectives.${index}.description`)}
                      className="w-full min-h-[80px] p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    />
                  </div>

                  {/* Remove Sub-Objective */}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-800 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove Sub-Objective
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ title: '', description: '' })}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              + Add Sub-Objective
            </button>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority Level */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-3">
                Priority Level
              </label>
              <div className="relative">
                <Controller
                  name="priorityLevel"
                  control={control}
                  rules={{
                    required: 'Please select a priority level',
                    validate: (value) =>
                      ['Low', 'Medium', 'High'].includes(value) || 'Priority must be Low, Medium, or High',
                  }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full p-4 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
                    >
                      <option value="">Select level</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  )}
                />
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                {errors.priorityLevel && (
                  <p className="text-red-500 text-sm mt-1">{errors.priorityLevel.message}</p>
                )}
              </div>
            </div>

            {/* Task Start Date */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-3">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register('startDate', {
                    required: 'Start date is required',
                    validate: (value) =>
                      !isNaN(new Date(value).getTime()) || 'Invalid date format',
                  })}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
                />
                <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                )}
              </div>
            </div>

            {/* Task End Date */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-3">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register('endDate', {
                    required: 'End date is required',
                    validate: {
                      validDate: (value) => !isNaN(new Date(value).getTime()) || 'Invalid date format',
                      afterStart: (value, formValues) =>
                        !formValues.startDate ||
                        new Date(value) >= new Date(formValues.startDate) ||
                        'End date must be after start date',
                    },
                  })}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
                />
                <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {isSuccess && (
            <div className="text-green-600 font-medium">
              Objective created successfully!
            </div>
          )}
          {isError && (
            <div className="text-red-600 font-medium">
              Error: {error?.data?.errors?.join(', ') || error?.data?.message || 'Failed to create objective'}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isLoading
                  ? 'bg-green-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddObjectivesForm;