// import { useForm, useFieldArray } from "react-hook-form";
// import ModalWrapper from "../ModalWrapper";
// import { Dialog } from "@headlessui/react";
// import Textbox from "../Textbox";
// import Button from "../Button";
// import { useCreateSubTaskMutation } from "../../redux/slices/api/taskApiSlice";
// import { toast } from "sonner";

// const AddSubTask = ({ open, setOpen, id }) => {
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       objectives: Array(10).fill({ description: "" }), // Initialize 10 objective fields
//     },
//   });

//   const { fields } = useFieldArray({
//     control,
//     name: "objectives",
//   });

//   const [addSubTask] = useCreateSubTaskMutation();

//   const handleOnSubmit = async (data) => {
//     // Validate that exactly 10 objectives are filled in
//     if (data.objectives.filter((obj) => obj.description).length !== 10) {
//       toast.error("You must add exactly 10 objectives");
//       return;
//     }

//     try {
//       const res = await addSubTask({ data, id }).unwrap();
//       toast.success("Sub Task Added");
//       setTimeout(() => {
//         setOpen(false);
//       }, 500);
//     } catch (err) {
//       console.log(err);
//       toast.error(err?.data?.message || err.error);
//     }
//   };

//   return (
//     <ModalWrapper open={open} setOpen={setOpen}>
//       <form onSubmit={handleSubmit(handleOnSubmit)} className="">
//         <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
//           ADD SUB-TASK
//         </Dialog.Title>
//         <div className="mt-2 flex flex-col gap-6">
//           <Textbox
//             placeholder="Add Tasks"
//             type="text"
//             name="title"
//             label="Title"
//             className="w-full rounded"
//             register={register("title", { required: "Title is required!" })}
//             error={errors.title ? errors.title.message : ""}
//           />

//           <div className="flex items-center gap-4">
//             <Textbox
//               placeholder="Date"
//               type="date"
//               name="date"
//               label="Task Date"
//               className="w-full rounded"
//               register={register("date", { required: "Date is required!" })}
//               error={errors.date ? errors.date.message : ""}
//             />
//             <Textbox
//               placeholder="Tag (1-5)"
//               type="number"
//               name="tag"
//               label="Tag"
//               className="w-full rounded"
//               register={register("tag", {
//                 required: "Tag is required!",
//                 valueAsNumber: true, // Converts string input to number
//                 min: { value: 1, message: "Tag must be at least 1" },
//                 max: { value: 5, message: "Tag must be at most 5" },
//               })}
//               error={errors.tag ? errors.tag.message : ""}
//             />
//           </div>

//           <div className="flex items-center gap-4">
//             <label className="block text-sm font-medium text-gray-700">Stage</label>
//             <select
//               name="stage"
//               className="w-full rounded"
//               {...register("stage", { required: "Stage is required!" })}
//             >
//               <option value="todo">To Do</option>
//               <option value="in progress">In Progress</option>
//               <option value="completed">Completed</option>
//             </select>
//             {errors.stage && <span className="text-red-600">{errors.stage.message}</span>}
//           </div>

//           {/* Objectives Section */}
//           <div className="mt-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Objectives (You must add exactly 10 objectives)
//             </label>
//             <div className="flex flex-col gap-2">
//               {fields.map((field, index) => (
//                 <div key={field.id} className="flex items-center gap-4">
//                   <Textbox
//                     placeholder={`Objective ${index + 1}`}
//                     type="text"
//                     name={`objectives[${index}].description`}
//                     className="w-full"
//                     register={register(`objectives[${index}].description`, {
//                       required: `Objective ${index + 1} is required!`,
//                     })}
//                     error={
//                       errors.objectives?.[index]?.description
//                         ? errors.objectives[index].description.message
//                         : ""
//                     }
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
//           <Button
//             type="submit"
//             className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
//             label="Add Task"
//           />
//           <Button
//             type="button"
//             className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto"
//             onClick={() => setOpen(false)}
//             label="Cancel"
//           />
//         </div>
//       </form>
//     </ModalWrapper>
//   );
// };

// export default AddSubTask;
import { useForm, useFieldArray } from "react-hook-form"; 
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";
import { useCreateSubTaskMutation, useGetSingleTaskQuery } from "../../redux/slices/api/taskApiSlice"; // Assuming there's a query for getting tasks
import { toast } from "sonner";

const AddSubTask = ({ open, setOpen, id }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      objectives: Array(10).fill({ description: "" }), // Initialize 10 objective field
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "objectives",
  });

  const [addSubTask] = useCreateSubTaskMutation();
  
  const { data: tasks } = useGetSingleTaskQuery(); // Replace with your task fetching logic

  const handleOnSubmit = async (data) => {
    const taskCount = tasks ? tasks.length : 0;  // Total existing tasks
    const nextTag = (taskCount % 5) + 1;  // Auto-assign tag between 1 and 5

    const taskData = {
      ...data,
      tag: nextTag,  // Automatically set the tag
    };

    // Validate that exactly 10 objectives are filled in
    if (data.objectives.filter((obj) => obj.description).length !== 10) {
      toast.error("You must add exactly 10 objectives");
      return;
    }

    try {
      const res = await addSubTask({ data: taskData, id }).unwrap();
      toast.success("Sub Task Added");
      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
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
              placeholder="Date"
              type="date"
              name="date"
              label="Task Date"
              className="w-full rounded"
              register={register("date", { required: "Date is required!" })}
              error={errors.date ? errors.date.message : ""}
            />
            {/* Tag will be automatically assigned */}
            <Textbox
              placeholder="Tag (Auto)"
              type="text"
              name="tag"
              label="Tag"
              className="w-full rounded"
              value={`Tag ${tasks ? (tasks.length % 5) + 1 : 1}`}  // Automatically show the next tag
              disabled
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700">Stage</label>
            <select
              name="stage"
              className="w-full rounded"
              {...register("stage", { required: "Stage is required!" })}
            >
              <option value="todo">To Do</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.stage && <span className="text-red-600">{errors.stage.message}</span>}
          </div>

          {/* Objectives Section */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Objectives (You must add exactly 10 objectives)
            </label>
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
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
          <Button
            type="submit"
            className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
            label="Add Task"
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
