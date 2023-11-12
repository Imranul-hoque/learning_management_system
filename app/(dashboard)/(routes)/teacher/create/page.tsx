"use client";

import { Form, FormField, FormItem, FormMessage, FormDescription, FormControl, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


const formSchema = z.object({
    title : z.string().min(1, { message : "Course Title is required" })
})

const CreateCourse = () => {

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            title: ""
        },
        resolver: zodResolver(formSchema)
    });

    const onSubmit = async (values : z.infer< typeof formSchema >) => {
        try {

            const course = await axios.post("/api/courses", values)
            toast.success("Course created")
            router.push(`/teacher/courses/${course.data.id}`)
        } catch (error:any) {
            console.log(error)
        }
    }

  return (
    <div className="p-5 max-w-5xl mx-auto h-[80vh] flex md:items-center md:justify-center">
      <div>
        <h1 className="text-2xl font-bold ">Name your Course</h1>
        <p className="text-slate-600 font-[500]">
          what would you like to name your course ? Don&apos;t you can change it
          later.
              </p>
              
              <Form {...form}> 
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField 
                          name='title'
                          control={form.control}
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                      <Input disabled={form.formState.isSubmitting} placeholder="e.g 'Advanced wev development course'" {...field} />
                                  </FormControl>
                                  <FormDescription>What you are teaching in this course?</FormDescription>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <div className='flex justify-end gap-x-2'>
                          <Button disabled={form.formState.isSubmitting} variant={"ghost"}>Cancel</Button>
                          <Button disabled={form.formState.isSubmitting}>Continue</Button>
                      </div>
                  </form>
              </Form>
      </div>
    </div>
  );
};

export default CreateCourse;
