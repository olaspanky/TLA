import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { useUpdateUserMutation } from "../redux/slices/api/userApiSlice";
import { selectCurrentUser } from "../redux/slices/authSlice";

const AddUser = ({ open, setOpen, userData }) => {
  let defaultValues = userData ?? {};
   const { user, auth } = useSelector((state) => ({
    user: selectCurrentUser(state),
    auth: state.auth
  }));


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
const dispatch = useDispatch()
  const [addNewUser, {isLoading}] = useRegisterMutation()
  const [updateUser, {isLoading: isUpdating}] = useUpdateUserMutation()
  const handleOnSubmit = async (data) => {
    try{
      if(userData){
const result = await updateUser(data).unwrap()
toast.success(result?.message)

if(userData?._id === user > _id){
  dispatch(setCredentials({...result.user}))
}
      }else {
        const result = await addNewUser({...data, password: data.email}).unwrap();
        toast.success("New User Added Succesfully")
      }
      setTimeout(()=> {
        setOpen(false);

      }, 1500)
    } catch(error){
      toast.error("something went Wrong");
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Full name'
              type='text'
              name='name'
              label='Full Name'
              className='w-full rounded'
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder='Title'
              type='text'
              name='title'
              label='Title'
              className='w-full rounded'
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox
              placeholder='Email Address'
              type='email'
              name='email'
              label='Email Address'
              className='w-full rounded'
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />

            <Textbox
              placeholder='Department'
              type='text'
              name='dept'
              label='Dept'
              className='w-full rounded'
              register={register("dept", {
                required: "User department is required!",
              })}
              error={errors.dept ? errors.dept.message : ""}
            />
            <Textbox
              placeholder='Role'
              type='text'
              name='role'
              label='Role'
              className='w-full rounded'
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />
            <div className="flex justify-between gap-3">
            <Textbox
              placeholder='securityQuestion'
              type='text'
              name='securityQuestion'
              label='securityQuestion'
              className='w-full rounded'
              register={register("securityQuestion", {
                required: " securityQuestion is required!",
              })}
              error={errors.securityQuestion ? errors.securityQuestion.message : ""}
            />
            <Textbox
              placeholder='securityAnswer'
              type='text'
              name='securityAnswer'
              label='securityAnswer'
              className='w-full rounded'
              register={register("securityAnswer", {
                required: " securityAnswer is required!",
              })}
              error={errors.securityAnswer ? errors.securityAnswer.message : ""}
            />
            </div>
           
          </div>

          {isLoading  ? (
            <div className='py-5'>
              <Loading />
            </div>
          ) : (
            <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                label='Submit'
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          )}
        </form>
      </ModalWrapper>
      <ToastContainer /> 

    </>
  );
};

export default AddUser;
