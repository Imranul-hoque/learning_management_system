"use client";

import * as z from 'zod';
import { Form, FormItem, FormField, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface TitleFormProps {
    initialData: {
        title: string;
    },
    courseId: string;
}


const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" })
});



export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
    
    
    const [editing, setIsEditing] = useState<boolean>();
    const router = useRouter();


    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: initialData,
        resolver: zodResolver(formSchema)
    });

    const toggle = () => {
        setIsEditing((prev) => !prev)
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Title Updated");  
            router.refresh()
            setIsEditing(false);
        } catch (error) {
            console.log(error as any)
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md shadow-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Title

                <Button onClick={toggle} variant={"ghost"}>
                    {
                        editing ? (
                            <>
                                Cancel
                            </>
                        ): (
                                <div className='flex items-center gap-x-2'>
                                    Edit 
                                    <Pencil className='h-4 w-4' />
                                </div>     
                        )
                    }
                </Button>
            </div>

            {
                !editing && (
                    <span>{initialData.title}</span>
                )
            }
            {
                editing && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                name='title'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                className='disabled:cursor-not-allowed placeholder:text-slate-600'
                                                disabled={form.formState.isSubmitting}
                                                placeholder={initialData.title} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                               
                            />
                            <div className='mt-3 flex justify-end'>
                                <Button disabled={form.formState.isSubmitting} type='submit'>Continue</Button>
                            </div>
                        </form>
                    </Form>
                )
            }
        </div>
    )
}