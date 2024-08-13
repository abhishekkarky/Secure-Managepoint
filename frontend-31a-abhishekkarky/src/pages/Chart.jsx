import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getBroadcastCountForGraph, getSubscriberCountForGraph } from "../apis/api";

const ApexChart = () => {
    const [subscribersData, setSubscribersData] = useState([]);
    const [broadcastData, setBroadcastData] = useState([]);
    const [options, setOptions] = useState({
        chart: {
            height: 400,
            type: 'area'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        yaxis: {
            min: 0,
            max: 100,
            labels: {
                formatter: function (value) {
                    return value.toFixed(0);
                }
            }
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm',
            },
            style: {
                fontSize: '14px',
                color: '#000000'
            }
        },
        colors: ['#F18E2A', '#4E79A7']
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subscribersResponse = await getSubscriberCountForGraph();
                setSubscribersData(subscribersResponse.data.counts);

                const broadcastResponse = await getBroadcastCountForGraph();
                setBroadcastData(broadcastResponse.data.counts);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (subscribersData.length > 0 && broadcastData.length > 0) {
            setOptions(prevOptions => ({
                ...prevOptions,
                series: [
                    { name: 'Subscribers', data: subscribersData },
                    { name: 'Broadcast', data: broadcastData }
                ]
            }));
        }
    }, [subscribersData, broadcastData]);

    return (
        <div>
            <div id="chart">
                <ReactApexChart
                    options={options}
                    series={[
                        { name: 'Subscribers', data: subscribersData },
                        { name: 'Broadcast', data: broadcastData }
                    ]}
                    type="area"
                    height={400}
                />

            </div>
            <div id="html-dist"></div>
        </div>
    );
}

export default ApexChart;
