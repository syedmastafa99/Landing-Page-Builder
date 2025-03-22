import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { GripVertical, Image, Video, Plus, Trash2, Layers, Code2, Rocket } from 'lucide-react';

// ===============================
// Types & Interfaces
// ===============================

interface Block {
    id: string;
    type: 'hero' | 'features' | 'content' | 'gallery' | 'cta' | 'video';
    content: any; // Flexible content structure
    styles: React.CSSProperties;
}

// ===============================
// Mock Data & Constants
// ===============================

const DESIGN_OPTIONS = [
    { label: 'Clean', value: 'clean' },
    { label: 'Modern', value: 'modern' },
    { label: 'Bold', value: 'bold' },
    { label: 'Creative', value: 'creative' },
];

// ===============================
// Helper Functions
// ===============================

const createEmptyBlock = (type: Block['type']): Block => {
    switch (type) {
        case 'hero':
            return {
                id: crypto.randomUUID(),
                type,
                content: {
                    title: 'Your Catchy Headline',
                    subtitle: 'Describe your product or service',
                    imageUrl: 'https://placehold.co/800x400/EEE/31343C',
                    buttonText: 'Get Started',
                },
                styles: {
                    backgroundColor: '#f9fafb',
                    color: '#333',
                    padding: '6rem 0',
                    textAlign: 'center',
                },
            };
        case 'features':
            return {
                id: crypto.randomUUID(),
                type,
                content: {
                    title: 'Key Features',
                    items: [
                        { title: 'Feature 1', description: 'Description of feature 1', icon: '🚀' },
                        { title: 'Feature 2', description: 'Description of feature 2', icon: '💡' },
                        { title: 'Feature 3', description: 'Description of feature 3', icon: '🌟' },
                    ],
                },
                styles: {
                    backgroundColor: '#fff',
                    padding: '4rem 0',
                    textAlign: 'center',
                },
            };
        case 'content':
            return {
                id: crypto.randomUUID(),
                type,
                content: {
                    title: 'About Us',
                    text: 'Detailed information about your company or product.  This is a flexible content block that can be used to display a variety of information. Add more text here...',
                },
                styles: {
                    backgroundColor: '#f3f4f6',
                    padding: '4rem 0',
                    color: '#444',
                },
            };
        case 'gallery':
            return {
                id: crypto.randomUUID(),
                type,
                content: {
                    title: 'Image Gallery',
                    images: [
                        'https://placehold.co/400x300/EEE/31343C',
                        'https://placehold.co/400x300/EEE/31343C',
                        'https://placehold.co/400x300/EEE/31343C',
                    ],
                },
                styles: {
                    backgroundColor: '#fff',
                    padding: '4rem 0',
                },
            };
        case 'cta':
            return {
                id: crypto.randomUUID(),
                type,
                content: {
                    title: 'Ready to Get Started?',
                    buttonText: 'Sign Up Now',
                },
                styles: {
                    backgroundColor: '#6366f1',
                    padding: '4rem 0',
                    color: '#fff',
                    textAlign: 'center',
                },
            };
        case 'video':
            return {
                id: crypto.randomUUID(),
                type,
                content: {
                    title: 'Promotional Video',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example URL
                },
                styles: {
                    backgroundColor: '#f9fafb',
                    padding: '4rem 0',
                    textAlign: 'center',
                },
            };
        default:
            return createEmptyBlock('hero');
    }
};

// ===============================
// Sub-Components
// ===============================
const DraggableHandle = () => (
    <div className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-gray-400" />
    </div>
);

const BlockPreview = ({ block }: { block: Block }) => {
    switch (block.type) {
        case 'hero':
            return (
                <div style={block.styles} className="p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold" style={{ color: block.styles.color }}>{block.content.title}</h1>
                    <p className="text-lg" style={{ color: block.styles.color }}>{block.content.subtitle}</p>
                    <img src={block.content.imageUrl} alt="Hero" className="mt-4 rounded-md w-full" />
                    <Button className="mt-6">{block.content.buttonText}</Button>
                </div>
            );
        case 'features':
            return (
                <div style={block.styles} className="p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: block.styles.color }}>{block.content.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {block.content.items.map((item: any, index: number) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl mb-2">{item.icon}</div>
                                <h3 className="text-xl font-semibold" style={{ color: block.styles.color }}>{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'content':
            return (
                <div style={block.styles} className="p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: block.styles.color }}>{block.content.title}</h2>
                    <p className="text-gray-700 whitespace-pre-line">{block.content.text}</p>
                </div>
            );
        case 'gallery':
            return (
                <div style={block.styles} className="p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: block.styles.color }}>{block.content.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {block.content.images.map((image: string, index: number) => (
                            <img key={index} src={image} alt={`Gallery ${index}`} className="rounded-md w-full" />
                        ))}
                    </div>
                </div>
            );
        case 'cta':
            return (
                <div style={block.styles} className="p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: block.styles.color }}>{block.content.title}</h2>
                    <Button className="text-lg">{block.content.buttonText}</Button>
                </div>
            );
        case 'video':
            return (
                <div style={block.styles} className="p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: block.styles.color }}>{block.content.title}</h2>
                    <div className="relative w-full aspect-w-16 aspect-h-9">
                        <iframe
                            className="absolute inset-0 w-full h-full rounded-lg"
                            src={block.content.videoUrl}
                            title="Video"
                            allowFullScreen
                        />
                    </div>
                </div>
            );
        default:
            return <div>Invalid Block Type</div>;
    }
};

const BlockEditor = ({ block, onUpdateBlock, onDeleteBlock }: { block: Block; onUpdateBlock: (id: string, updates: Partial<Block>) => void; onDeleteBlock: (id: string) => void }) => {
    const handleContentChange = useCallback(
        (newContent: any) => {
            onUpdateBlock(block.id, { content: newContent });
        },
        [block.id, onUpdateBlock]
    );

    const handleStyleChange = useCallback(
        (newStyles: React.CSSProperties) => {
            onUpdateBlock(block.id, { styles: newStyles });
        },
        [block.id, onUpdateBlock]
    );

    switch (block.type) {
        case 'hero':
            return (
                <div className="space-y-4">
                    <Label>Title</Label>
                    <Input value={block.content.title} onChange={(e) => handleContentChange({ ...block.content, title: e.target.value })} />
                    <Label>Subtitle</Label>
                    <Input value={block.content.subtitle} onChange={(e) => handleContentChange({ ...block.content, subtitle: e.target.value })} />
                    <Label>Image URL</Label>
                    <Input value={block.content.imageUrl} onChange={(e) => handleContentChange({ ...block.content, imageUrl: e.target.value })} />
                    <Label>Button Text</Label>
                    <Input value={block.content.buttonText} onChange={(e) => handleContentChange({ ...block.content, buttonText: e.target.value })} />
                    <Label>Background Color</Label>
                    <Input type="color" value={block.styles.backgroundColor} onChange={(e) => handleStyleChange({ ...block.styles, backgroundColor: e.target.value })} />
                    <Label>Text Color</Label>
                    <Input type="color" value={block.styles.color} onChange={(e) => handleStyleChange({ ...block.styles, color: e.target.value })} />
                    <Label>Padding</Label>
                    <Input value={block.styles.padding} onChange={(e) => handleStyleChange({ ...block.styles, padding: e.target.value })} />
                    <Label>Text Alignment</Label>
                    <Select value={block.styles.textAlign} onValueChange={(value) => handleStyleChange({ ...block.styles, textAlign: value as React.CSSProperties['textAlign'] })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select alignment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="destructive" onClick={() => onDeleteBlock(block.id)} className="mt-4">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Block
                    </Button>
                </div>
            );
        case 'features':
            return (
                <div className="space-y-4">
                    <Label>Title</Label>
                    <Input value={block.content.title} onChange={(e) => handleContentChange({ ...block.content, title: e.target.value })} />
                    <Label>Features</Label>
                    {block.content.items.map((item: any, index: number) => (
                        <div key={index} className="border rounded-md p-2 mb-2 space-y-2">
                            <Input value={item.title} onChange={(e) => {
                                const newItems = [...block.content.items];
                                newItems[index] = { ...item, title: e.target.value };
                                handleContentChange({ ...block.content, items: newItems });
                            }} placeholder={`Feature ${index + 1} Title`} />
                            <Input value={item.description} onChange={(e) => {
                                const newItems = [...block.content.items];
                                newItems[index] = { ...item, description: e.target.value };
                                handleContentChange({ ...block.content, items: newItems });
                            }} placeholder={`Feature ${index + 1} Description`} />
                            <Input value={item.icon} onChange={(e) => {
                                const newItems = [...block.content.items];
                                newItems[index] = { ...item, icon: e.target.value };
                                handleContentChange({ ...block.content, items: newItems });
                            }} placeholder={`Feature ${index + 1} Icon`} />
                        </div>
                    ))}
                    <Button onClick={() => {
                        const newItems = [...block.content.items, { title: '', description: '', icon: '' }];
                        handleContentChange({ ...block.content, items: newItems });
                    }} className="mb-4">
                        <Plus className="mr-2 h-4 w-4" /> Add Feature
                    </Button>
                    <Label>Background Color</Label>
                    <Input type="color" value={block.styles.backgroundColor} onChange={(e) => handleStyleChange({ ...block.styles, backgroundColor: e.target.value })} />
                    <Label>Text Color</Label>
                    <Input type="color" value={block.styles.color} onChange={(e) => handleStyleChange({ ...block.styles, color: e.target.value })} />
                    <Label>Padding</Label>
                    <Input value={block.styles.padding} onChange={(e) => handleStyleChange({ ...block.styles, padding: e.target.value })} />
                    <Label>Text Alignment</Label>
                    <Select value={block.styles.textAlign} onValueChange={(value) => handleStyleChange({ ...block.styles, textAlign: value as React.CSSProperties['textAlign'] })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select alignment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="destructive" onClick={() => onDeleteBlock(block.id)} className="mt-4">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Block
                    </Button>
                </div>
            );
        case 'content':
            return (
                <div className="space-y-4">
                    <Label>Title</Label>
                    <Input value={block.content.title} onChange={(e) => handleContentChange({ ...block.content, title: e.target.value })} />
                    <Label>Text</Label>
                    <textarea
                        value={block.content.text}
                        onChange={(e) => handleContentChange({ ...block.content, text: e.target.value })}
                        className="w-full h-48 border rounded-md p-2"
                    />
                    <Label>Background Color</Label>
                    <Input type="color" value={block.styles.backgroundColor} onChange={(e) => handleStyleChange({ ...block.styles, backgroundColor: e.target.value })} />
                    <Label>Text Color</Label>
                    <Input type="color" value={block.styles.color} onChange={(e) => handleStyleChange({ ...block.styles, color: e.target.value })} />
                    <Label>Padding</Label>
                    <Input value={block.styles.padding} onChange={(e) => handleStyleChange({ ...block.styles, padding: e.target.value })} />
                    <Button variant="destructive" onClick={() => onDeleteBlock(block.id)} className="mt-4">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Block
                    </Button>
                </div>
            );
        case 'gallery':
            return (
                <div className="space-y-4">
                    <Label>Title</Label>
                    <Input value={block.content.title} onChange={(e) => handleContentChange({ ...block.content, title: e.target.value })} />
                    <Label>Images</Label>
                    {block.content.images.map((image: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <Input value={image} onChange={(e) => {
                                const newImages = [...block.content.images];
                                newImages[index] = e.target.value;
                                handleContentChange({ ...block.content, images: newImages });
                            }} placeholder={`Image ${index + 1} URL`} />
                        </div>
                    ))}
                    <Button onClick={() => {
                        const newImages = [...block.content.images, ''];
                        handleContentChange({ ...block.content, images: newImages });
                    }} className="mb-4">
                        <Plus className="mr-2 h-4 w-4" /> Add Image
                    </Button>
                    <Label>Background Color</Label>
                    <Input type="color" value={block.styles.backgroundColor} onChange={(e) => handleStyleChange({ ...block.styles, backgroundColor: e.target.value })} />
                    <Label>Padding</Label>
                    <Input value={block.styles.padding} onChange={(e) => handleStyleChange({ ...block.styles, padding: e.target.value })} />
                    <Button variant="destructive" onClick={() => onDeleteBlock(block.id)} className="mt-4">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Block
                    </Button>
                </div>
            );
        case 'cta':
            return (
                <div className="space-y-4">
                    <Label>Title</Label>
                    <Input value={block.content.title} onChange={(e) => handleContentChange({ ...block.content, title: e.target.value })} />
                    <Label>Button Text</Label>
                    <Input value={block.content.buttonText} onChange={(e) => handleContentChange({ ...block.content, buttonText: e.target.value })} />
                    <Label>Background Color</Label>
                    <Input type="color" value={block.styles.backgroundColor} onChange={(e) => handleStyleChange({ ...block.styles, backgroundColor: e.target.value })} />
                    <Label>Text Color</Label>
                    <Input type="color" value={block.styles.color} onChange={(e) => handleStyleChange({ ...block.styles, color: e.target.value })} />
                    <Label>Padding</Label>
                    <Input value={block.styles.padding} onChange={(e) => handleStyleChange({ ...block.styles, padding: e.target.value })} />
                    <Label>Text Alignment</Label>
                    <Select value={block.styles.textAlign} onValueChange={(value) => handleStyleChan
