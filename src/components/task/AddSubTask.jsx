import { useForm, useFieldArray } from "react-hook-form";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";
import { useCreateSubTaskMutation, useGetSingleTaskQuery } from "../../redux/slices/api/taskApiSlice";
import { toast } from "sonner";
const AddSubTask = ({ open, setOpen, id }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      objectives: [{ description: "" }], // Start with one objective
      date: new Date().toISOString().split("T")[0], // Default to today's date
      startDate: "", // Default start date
      completionDate: "", // Default completion date
      team: [], // Default empty team
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "objectives",
  });

  const [addSubTask] = useCreateSubTaskMutation();
  const { data: taskData } = useGetSingleTaskQuery(id); // Fetch the parent task details

  const handleOnSubmit = async (data) => {
    if (!id) {
      toast.error("Task ID is missing.");
      return;
    }

    const taskCount = taskData?.task?.subTasks?.length || 0;
    const nextTag = (taskCount % 5) + 1;

    const taskDataToSend = {
      ...data,
      tag: nextTag,
    };

    try {
      await addSubTask({ data: taskDataToSend, id }).unwrap();
      toast.success("Sub Task Added");
      setTimeout(() => {
        setOpen(false);
      }, 500);
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || "Failed to add subtask");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="">
        <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
          ADD SUB-TASK
        </Dialog.Title>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Add Tasks"
            type="text"
            name="title"
            label="Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required!" })}
            error={errors.title ? errors.title.message : ""}
          />

          <div className="flex items-center gap-4">
            <Textbox
              placeholder="Start Date"
              type="date"
              name="startDate"
              label="Start Date"
              className="w-full rounded"
              register={register("startDate", { required: "Start date is required!" })}
              error={errors.startDate ? errors.startDate.message : ""}
            />
            <Textbox
              placeholder="Completion Date"
              type="date"
              name="completionDate"
              label="Completion Date"
              className="w-full rounded"
              register={register("completionDate", { required: "Completion date is required!" })}
              error={errors.completionDate ? errors.completionDate.message : ""}
            />
          </div>

          {/* Team Selection */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Assign Team Members</label>
            <select
              name="team"
              className="w-full rounded"
              multiple
              {...register("team", { required: "At least one team member is required!" })}
            >
              {taskData?.task?.team?.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.title})
                </option>
              ))}
            </select>
            {errors.team && <span className="text-red-600">{errors.team.message}</span>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Task Objectives</label>
            <div className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <Textbox
                    placeholder={`Objective ${index + 1}`}
                    type="text"
                    name={`objectives[${index}].description`}
                    className="w-full"
                    register={register(`objectives[${index}].description`, {
                      required: `Objective ${index + 1} is required!`,
                    })}
                    error={
                      errors.objectives?.[index]?.description
                        ? errors.objectives[index].description.message
                        : ""
                    }
                  />
                  <Button
                    type="button"
                    className="text-red-500"
                    onClick={() => remove(index)}
                    label="Remove"
                  />
                </div>
              ))}
              <Button
                type="button"
                className="bg-gray-200 text-sm font-semibold text-gray-900 mt-2"
                onClick={() => append({ description: "" })}
                label="Add Objective"
              />
            </div>
          </div>
        </div>

        <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
          <Button
            type="submit"
            className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
            label="Add Subtask"
          />
          <Button
            type="button"
            className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto"
            onClick={() => setOpen(false)}
            label="Cancel"
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddSubTask;
