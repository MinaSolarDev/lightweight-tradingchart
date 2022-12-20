import { useEffect, useCallback, useState } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";
import { useQuery } from "@apollo/client";
import { FILMS_QUERY } from "../gql/Query";

import preloader from'../preloader.svg';

function ChartView( props ) {

    const indicatorColors = {adx:'#ddf731', macd:'#21ed36', mdi:'#4621ed', sma:'#ed28e7'}

    const { loading, error, data } = useQuery(FILMS_QUERY, 
        { 
            variables: { 
                symbol: "AAPL",
                start:  `${props.startDate}`,
                end: `${props.endDate}`,
                resample: `PT${props.resample === "1H" ? "60M" : props.resample === "1D" ? "1440M" : props.resample === "1W" ? "10080M" : props.resample }`,
            }
        }
    )

    const [currentInfo, setCurrentInfo] = useState({})
    
    useEffect(() => {
        var _current = {
            main: {}
        }
        props.indicators.forEach((key) => {
            _current[key] = {}
        })
        setCurrentInfo(_current)
    }, []);

    useEffect(() => {
        if(data) {
            if(data.symbols){
                var _arr = {
                    main: []
                };
                var _current = {
                    main: {}
                }
                if(props.indicators.length > 0) {
                    props.indicators.forEach((indic) => {
                        _arr[indic] = []
                        _current[indic] = {}
                    })
                }
                data.symbols[0].priceInfo.chartData.forEach((item) => {
                    var _time = Math.floor(new Date(item.date).getTime() / 1000)
                    _arr.main.push({
                        open : item.open,
                        high: item.high,
                        low : item.low,
                        close : item.close,
                        time : _time,
                        value : item.volume,
                        indicators : item.indicators,
                        color: item.open > item.close ? "rgba(200, 12, 20, 0.5)" : "rgba(38, 166, 154, 0.5)"
                    })
                    if(item.indicators) {
                        Object.keys(item.indicators).forEach((key) => {
                            if(_arr[key]) {
                                _arr[key].push({
                                    time: _time,
                                    value: item.indicators[key]
                                })
                                _current[key] = item.indicators[key]
                            }
                        })
                    }
                })

                _current.main = {..._arr.main[_arr.main.length - 1]}
                setCurrentInfo(_current);
                init(_arr)
            }
        }
    }, [data, props.indicators.length]);

    const init = useCallback((chartData) => {
        document.getElementById(`${props.viewID}`).innerHTML = '';
        const chart = createChart(document.getElementById(`${props.viewID}`), {
            width: 600,
            height: 350,
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            timeScale: {
                rightOffset: 5,
                barSpacing: 7,
                fixLeftEdge: true,
                lockVisibleTimeRangeOnResize: true,
                rightBarStaysOnScroll: true,
                borderVisible: true,
                borderColor: '#fff000',
                visible: true,
                timeVisible: true,
                secondsVisible: true,
                // fixRightEdge: true,
            },
            overlayPriceScales: {
                scaleMargins: {
                    top: 0.6,
                    bottom: 0,
                }
            },
            rightPriceScale: {
                autoScale: true,
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.08,
                }
            },
            layout: {
                background: {
                    color: "#131722",
                },
                textColor: "#d1d4dc",
            },
            grid: {
                vertLines: {
                    color: "rgba(42, 46, 57, 0.5)",
                },
                horzLines: {
                    color: "rgba(42, 46, 57, 0.5)", 
                },
            },
        });

        var volumeSeries = chart.addHistogramSeries({
            lineWidth: 1,
            priceFormat: {
                type: "volume",
            },
            overlay: true,
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
            priceScaleId: '',
            pane: 0
        });
        var candleSeries = chart.addCandlestickSeries();
        candleSeries.setData(chartData.main);
        volumeSeries.setData(chartData.main);

        var adxIndicatorSeries = chart.addLineSeries({
            lineWidth: 2,
            color: indicatorColors.adx,
            // title: 'adx'.toUpperCase()
        })

        var macdIndicatorSeries = chart.addLineSeries({
            lineWidth: 2,
            color: indicatorColors.macd,
            // title: 'macd'.toUpperCase()
        })

        var mdiIndicatorSeries = chart.addLineSeries({
            lineWidth: 2,
            color: indicatorColors.mdi,
            // title: 'mdi'.toUpperCase()
        })

        var smaIndicatorSeries = chart.addLineSeries({
            lineWidth: 2,
            color: indicatorColors.sma,
            // title: 'sma'.toUpperCase()
        })

        var indicatorSeries = {
            adx: adxIndicatorSeries, 
            macd: macdIndicatorSeries, 
            mdi: mdiIndicatorSeries, 
            sma: smaIndicatorSeries
        }
        if(props.indicators.length > 0) {
            props.indicators.forEach((indic, index) => {
                indicatorSeries[indic].applyOptions({pane: index + 1})
                indicatorSeries[indic].setData(chartData[indic])
            })
        }

        const getLastBar = () => {
            var _return = {};
            _return['main'] = chartData.main[chartData.main.length - 1];
            props.indicators.forEach((key) => {
                _return[key] = chartData[key][chartData[key].length - 1].value
            })
            return _return
        }

        chart.subscribeCrosshairMove((param) => {
            const validCrosshairPoint = !(
                param === undefined || param.time === undefined || param.point.x < 0 || param.point.y < 0
            );
            if(validCrosshairPoint) {
                var infos = {}
                infos['main'] = param.seriesData.get(candleSeries);
                infos.main['value'] = param.seriesData.get(volumeSeries).value;
                
                if(props.indicators.length  > 0) {
                    props.indicators.forEach((key, i) => {
                        infos[key] = param.seriesData.get(indicatorSeries[key]).value
                    })
                }
                setCurrentInfo(infos);
            } else {
                setCurrentInfo(getLastBar());
            }
        });
    }, []);

    const onSelectChart = (item) => {
        if (item === props.active) {
            return;
        }
        props.selectChart(item);
    }

    return (
        <div className={props.active === props.viewID ? "chart-view actived-chart" : 'chart-view'} onClick={() => onSelectChart(props.viewID)} >
            {loading ? (
                <img src={preloader} className="preloader" />
            ) : error ? (
                <p className="error">Error: Fail API calling</p>
            ) : (
                <div className="chart-item">
                    <div id={props.viewID} />
                    <div className="chart-infos">
                        <p className="infos">
                            AAPL <strong className="main-info white">{props.resample}</strong> 
                            O<span className="main-info">{ currentInfo.main.open }</span>
                            H<span className="main-info">{ currentInfo.main.high }</span>
                            L<span className="main-info">{ currentInfo.main.low }</span>
                            C<span className="main-info">{ currentInfo.main.close }</span>
                        </p>
                        <p className="infos">
                            Vol<span className="main-info">{ currentInfo.main.value }</span>
                        </p>
                        { props.indicators.length > 0 && 
                            props.indicators.map((key, i) => (
                                <p className="infos" key={key}>
                                    {key.toUpperCase()} <span className="main-info" style={{color: `${indicatorColors[key]}`}}>{ currentInfo[key] !== undefined && Number(currentInfo[key]).toFixed(2) }</span>
                                </p>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChartView;
