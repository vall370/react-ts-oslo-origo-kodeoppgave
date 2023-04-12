import React, { useEffect, useState } from 'react';
import './StationsList.css';

interface StationInformationResponse {
    last_updated: number;
    ttl: number;
    data: {
        stations: Station[];
    };
}

interface Station {
    station_id: string;
    name: string;
    address: string;
    lat: number;
    lon: number;
    capacity: number;
}
interface StationStatusResponse {
    last_updated: number;
    ttl: number;
    data: {
        stations: StationStatus[];
    };
}

interface StationStatus {
    station_id: string;
    is_installed: number;
    is_renting: number;
    is_returning: number;
    last_reported: number;
    num_bikes_available: number;
    num_docks_available: number;
}
const StationsList: React.FC = () => {
    const [stations, setStations] = useState<Station[]>([]);
    const [statusData, setStatusData] = useState<StationStatus[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch station information and status data on component mount

    useEffect(() => {
        const fetchInformationData = async () => {
            try {
                const response = await fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch station information data');
                }
                const data: StationInformationResponse = await response.json();
                setStations(data.data.stations);
            } catch (error: any) {
                setError(error.message);
            }
        };

        // Fetch station status data

        const fetchStatusData = async () => {
            try {
                const response = await fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch station status data');
                }
                const data: StationStatusResponse = await response.json();
                setStatusData(data.data.stations);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchInformationData();
        fetchStatusData();
    }, []);

    // Get status data for a specific station

    const getStatusData = (stationId: string) => {
        const status = statusData.find((status) => status.station_id === stationId);
        if (status) {
            return (
                <>
                    <p>Bikes available: {status.num_bikes_available}</p>
                    <p>Locks empty: {status.num_docks_available}</p>
                </>
            );
        }
        return null;
    };

    // Sort stations by the number of remaining bikes

    const sortedStations = stations.sort((a, b) => {
        const aStatus = statusData.find((status) => status.station_id === a.station_id);
        const bStatus = statusData.find((status) => status.station_id === b.station_id);

        if (aStatus && bStatus) {
            return bStatus.num_bikes_available - aStatus.num_bikes_available;
        }

        return 0;
    });
    return (
        <div className="stations-list">
            <h1>Stations List</h1>
            {error ? (
                <div className="error">{error}</div>
            ) : (
                <ul>
                    {sortedStations.map((station) => (
                        <li key={station.station_id} className="station-item">
                            <h2>{station.name}</h2>
                            <div className="station-info">
                                <div className="station-address">
                                    <p>Address:</p>
                                    <p>{station.address}</p>
                                </div>
                                <div className="station-coordinates">
                                    <p>Location:</p>
                                    <p>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lon}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Show {station.name} on google maps

                                        </a>
                                    </p>
                                </div>
                                <div className="station-capacity">
                                    <p>Capacity:</p>
                                    <p>{station.capacity}</p>
                                </div>
                            </div>
                            <div className="station-status">{getStatusData(station.station_id)}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StationsList;