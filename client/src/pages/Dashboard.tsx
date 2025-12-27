import React, { useEffect, useState } from 'react';
import Container from '../components/ui/Container';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ConfigurationTm {
    selectedTm: string;
    isRandomInput: boolean;
    tmInput: string;
};

export default function Dashboard() {
    const [tms, setTms] = useState<string[]>([]);
    const [configurationTm, setConfigurationTm] = useState<ConfigurationTm>({
        selectedTm: '',
        isRandomInput: false,
        tmInput: "101110100101",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tmRes, tmsRes] = await Promise.all([
                    axios.get('http://localhost:8000/tm'),
                    axios.get('http://localhost:8000/tms')
                ]);

                setConfigurationTm({
                    selectedTm: tmRes.data.selectedTm || '',
                    isRandomInput: tmRes.data.isRandomInput || false,
                    tmInput: tmRes.data.tmInput || "101110100101",
                });
                setTms(tmsRes.data.tms);
            } catch (err) {
                toast.error("Failed to load dashboard data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleConfigChange = async (updates: Partial<ConfigurationTm>) => {
        const updatedConfig = { ...configurationTm, ...updates };
        setConfigurationTm(updatedConfig);

        try {
            await axios.put('http://localhost:8000/tm', updatedConfig);
            toast.success('Successfully updated configuration');
        } catch (err) {
            toast.error('Failed to update configuration');
            console.error(err);
        }
    };

    const handleSelectNewTm = (event: React.ChangeEvent<HTMLSelectElement>) => {
        handleConfigChange({ selectedTm: event.target.value });
    };

    const handleRandomToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleConfigChange({ isRandomInput: event.target.checked });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleConfigChange({ tmInput: event.target.value });
    };

    if (loading) {
        return (
            <Container padding='20px'>
                <div>Loading...</div>
            </Container>
        );
    }

    return (
        <Container padding='20px'>
            <div className='dashboard'>
                <h1>Dashboard for panel</h1>
                <div>
                    <select
                        value={configurationTm.selectedTm}
                        onChange={handleSelectNewTm}
                    >
                        {tms.map((tm) => (
                            <option key={tm} value={tm}>
                                {tm}
                            </option>
                        ))}
                    </select>
                    <form action="">
                        <div>
                            <label>
                                <input type="checkbox" name="option1" onChange={handleRandomToggle} /> Radom binary input
                            </label>
                        </div>
                        <input
                            id="binaryInput"
                            type="text"
                            inputMode="numeric"
                            pattern="[01]*"
                            placeholder="TM input (only binary input)"
                            onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                target.value = target.value.replace(/[^01]/g, '');
                            }}
                            onChange={handleInputChange}
                        />
                        <button type="button"></button>
                    </form>
                </div>
            </div>
        </Container>
    )
};
