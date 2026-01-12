import React, { useState } from 'react';
import { Box, Settings, Loader, Search } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Switch from './ui/Switch';
import Checkbox from './ui/Checkbox';
import Radio from './ui/Radio';
import Alert from './ui/Alert';
import Avatar from './ui/Avatar';
import Modal from './ui/Modal';

const ComponentLibrary = () => {
    const [toggle, setToggle] = useState(true);
    const [checkbox, setCheckbox] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [radioValue, setRadioValue] = useState('option1');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-[#111827]">UI Component Library</h2>
                <p className="text-gray-500">Core building blocks for the Donezo Design System.</p>
            </div>

            {/* 1. Typography & Colors */}
            <Card>
                <h3 className="text-lg font-bold text-[#111827] mb-6">Typography & Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-[#111827]">Heading 1</h1>
                        <h2 className="text-3xl font-bold text-[#111827]">Heading 2</h2>
                        <h3 className="text-2xl font-bold text-[#111827]">Heading 3</h3>
                        <h4 className="text-xl font-bold text-[#111827]">Heading 4</h4>
                        <p className="text-[#6B7280]">
                            Body text (Regular 400). The quick brown fox jumps over the lazy dog.
                            Clean, geometric, high readability, generous line height.
                        </p>
                        <p className="text-[#6B7280] text-sm">
                            Caption text (Small). Used for secondary information and help text.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-[#134E35] shadow-lg shadow-[#134E35]/20"></div>
                            <div>
                                <p className="font-bold text-[#111827]">Primary</p>
                                <p className="text-sm text-gray-500">Deep Emerald Green #134E35</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-[#4E7C63]"></div>
                            <div>
                                <p className="font-bold text-[#111827]">Secondary</p>
                                <p className="text-sm text-gray-500">Sage Green #4E7C63</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/50 border border-white/50 shadow-sm backdrop-blur-md"></div>
                            <div>
                                <p className="font-bold text-[#111827]">Glass Surface</p>
                                <p className="text-sm text-gray-500">White/60 + Blur</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 2. Buttons */}
            <Card>
                <h3 className="text-lg font-bold text-[#111827] mb-6">Buttons</h3>
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <Button>Primary Button</Button>
                        <Button variant="secondary">Secondary Button</Button>
                        <Button variant="ghost">Ghost Button</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button disabled>Disabled</Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Button variant="primary" size="icon">
                            <Box size={20} />
                        </Button>
                        <Button variant="secondary" size="icon">
                            <Settings size={20} />
                        </Button>
                        <Button isLoading>
                            Loading
                        </Button>
                    </div>
                </div>
            </Card>

            {/* 3. Form Elements */}
            <Card>
                <h3 className="text-lg font-bold text-[#111827] mb-6">Form Elements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        {/* Input Standard */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <Input type="email" placeholder="name@company.com" />
                        </div>
                        {/* Input with Icon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <Input type="text" placeholder="Search..." icon={Search} />
                        </div>
                        {/* Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <Select>
                                <option>Administrator</option>
                                <option>Editor</option>
                                <option>Viewer</option>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Toggle Switch */}
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-white/40 rounded-2xl backdrop-blur-sm">
                            <div>
                                <p className="text-sm font-medium text-[#111827]">Email Notifications</p>
                                <p className="text-xs text-gray-500">Receive daily summaries</p>
                            </div>
                            <Switch checked={toggle} onChange={setToggle} />
                        </div>

                        {/* Checkbox & Radio */}
                        <div className="flex flex-col gap-4">
                            <Checkbox
                                checked={checkbox}
                                onChange={setCheckbox}
                                label="Remember me"
                            />

                            <div className="flex gap-6 mt-2">
                                <Radio
                                    name="options"
                                    value="option1"
                                    checked={radioValue === 'option1'}
                                    onChange={() => setRadioValue('option1')}
                                    label="Option 1"
                                />
                                <Radio
                                    name="options"
                                    value="option2"
                                    checked={radioValue === 'option2'}
                                    onChange={() => setRadioValue('option2')}
                                    label="Option 2"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 4. Feedback & Status */}
            <Card>
                <h3 className="text-lg font-bold text-[#111827] mb-6">Feedback & Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Alerts */}
                    <div className="space-y-3">
                        <Alert variant="success" title="Success Message">
                            Your changes have been saved successfully.
                        </Alert>

                        <Alert variant="warning" title="Warning Notice">
                            Your account subscription expires in 3 days.
                        </Alert>

                        <Alert variant="error" title="Error Occurred">
                            Unable to connect to the server. Please try again.
                        </Alert>
                    </div>

                    {/* Badges & Chips */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Status Badges</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge status="Completed" />
                                <Badge status="Pending" />
                                <Badge status="Failed" />
                                <Badge status="Info" />
                                <Badge status="Neutral" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2">User Avatars</p>
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <Avatar
                                        key={i}
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`}
                                        alt="Avatar"
                                    />
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100/80 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-gray-500">
                                    +5
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 5. Modal Example */}
            <Card>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-[#111827]">Interactive Modal</h3>
                        <p className="text-sm text-gray-500">Standard dialog for confirmations and forms.</p>
                    </div>
                    <Button onClick={() => setShowModal(true)}>
                        Open Modal
                    </Button>
                </div>
            </Card>

            {/* Actual Modal Implementation */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Confirm Action"
            >
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#111827]">Confirm Action</h3>
                    <p className="text-gray-500 mt-2">
                        Are you sure you want to proceed? This action will update your design system settings permanently.
                    </p>
                </div>
                <div className="flex gap-3 mt-6">
                    <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button className="flex-1" onClick={() => setShowModal(false)}>
                        Confirm
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default ComponentLibrary;
