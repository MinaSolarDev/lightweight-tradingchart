function IntervalView( props ) {

    const onItemClicked = (item) => {
        if (item === props.chartArray[props.activeChart].resample) {
            return;
        }
        let temp = props.chartArray
        temp[props.activeChart].resample = item;
        props.setChartArray({...temp});
    }

    return (
        <div className="switcher">
            { props.intervals.map((item, index) => ( 
                <button 
                    className={`switcher-item ${ props.activeChart !== "" && item  === props.chartArray[props.activeChart].resample ? 'switcher-active-item' : '' }`}
                    onClick={ () => onItemClicked(item) } 
                    key={`${index}`} > 
                        {item} 
                </button>
            )) }
        </div>
    );
}

export default IntervalView;
