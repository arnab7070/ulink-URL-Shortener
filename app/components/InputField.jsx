'use client';
import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axios from 'axios';
import { useUrlStore } from '../zustand/store';
import { toast } from 'sonner';

const InputField = () => {
    const [inputValue, setInputValue] = useState("");
    const push = useUrlStore((state) => state.push);

    const handleGenerateClick = async () => {
        try {
            const result = await axios.post('/api', { url: inputValue });
            const { urlDetails } = result.data;
            if (result.data.success) push(urlDetails);
            await new Audio('https://ktj.in/sfx/enter.aac').play();
            toast.success("Short url has been generated");
        } catch (error) {
            console.log(error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleGenerateClick();
        }
    };

    return (
        <div className="flex max-w-screen-sm md:min-w-md justify-center items-center space-x-2 mx-1">
            <Input
                type="text"
                placeholder="https://www.example.com"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <Button className="bg-orange-600" type="button" onClick={handleGenerateClick}>
                Generate
            </Button>
        </div>
    );
};

export default InputField;
