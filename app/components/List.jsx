'use client';
import React, { useEffect, useState } from 'react';
import { useUrlStore } from '../zustand/store';
import Link from 'next/link';
import { toast } from "sonner";
import { Clipboard, ClipboardCheck, Eye, BadgeInfo, Link2, Copy, CalendarCheck, MousePointerClickIcon, ArrowUpRight } from 'lucide-react';
import axios from 'axios';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip"

const List = () => {
    const urlList = useUrlStore((state) => state.urlList);
    const [clipboardStatusArray, setClipboardStatusArray] = useState(new Array(urlList.length).fill(true));
    const [totalClicks, setTotalClicks] = useState(new Array(urlList.length).fill(0));;

    const clickHandler = async (shortUrl, index) => {
        try {
            toast("Fetching click count...");
            const res = await axios.put('/api', { shortUrl: shortUrl });
            const updatedTotalClicks = [...totalClicks];
            updatedTotalClicks[index] = res.data.clickCount;
            setTotalClicks(updatedTotalClicks);
            toast.dismiss(); // dismiss previous toast
            toast.success("Click Count Updated");
        } catch (error) {
            console.error('Error updating total clicks:', error.message);
        }
    }

    useEffect(() => {
        useUrlStore.persist.rehydrate();
    }, []);

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                const updatedArray = [...clipboardStatusArray];
                updatedArray[index] = !updatedArray[index];
                setClipboardStatusArray(updatedArray);
                toast("Link copied to clipboard");
            })
            .catch((err) => {
                toast('Unable to copy to clipboard', err);
            });
    };

    return (
        <div className='mt-5'>
            <Table>
                <TableCaption>A list of your recently generated short urls.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-white"><div className='flex gap-2'><BadgeInfo size={20} />ID</div></TableHead>
                        <TableHead className="w-[100px] text-white"><div className='flex gap-2'><MousePointerClickIcon size={20} /> Count</div></TableHead>
                        <TableHead className="text-white"><div className='flex gap-2'><Link2 size={20} /> Destination</div></TableHead>
                        <TableHead className="text-white"><div className='flex gap-2'><CalendarCheck size={20} /> Created</div></TableHead>
                        <TableHead className="text-white"><div className='flex gap-2'><Copy size={20} /> Link</div></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-zinc-100">
                    {urlList.map((urlDetails, index) => (
                        <TableRow key={index}>
                            <TableCell >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Link className='font-semibold flex underline'
                                                target='_blank'
                                                href={'/' + urlDetails.shortUrl}
                                            >
                                                {urlDetails.shortUrl}
                                                <ArrowUpRight size={15} className='ml-1' />
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Visit URL now</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                            <TableCell className="flex justify-center">
                                {totalClicks[index] >= 0 ? (
                                    totalClicks[index]
                                ) : (
                                    <Eye className='cursor-pointer' onClick={() => clickHandler(urlDetails.shortUrl, index)} />
                                )}
                            </TableCell>
                            <TableCell className="font-normal">{urlDetails.originalUrl.split('/')[2]}</TableCell>
                            <TableCell className="text-right font-extralight">{new Date(urlDetails.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
                            <TableCell className="flex justify-center">
                                <div className='cursor-pointer' onClick={(e) => {
                                    e.preventDefault();
                                    copyToClipboard(process.env.NEXT_PUBLIC_BASE_URL + urlDetails.shortUrl, index);
                                }}>
                                    {clipboardStatusArray[index] ? (
                                        <div className='flex gap-2'><ClipboardCheck height={18} width={18} className='ml-2' strokeWidth={2.65} />Copied</div>
                                    ) : (
                                        <div className='flex gap-2'><Clipboard onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_BASE_URL + urlDetails.shortUrl, index)} height={18} width={18} className='ml-2' />Copy</div>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default List;
