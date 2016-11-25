var React = require('react')
var TradePanel = require('./TradePanel')
var SearchInput = require('./search')
var Code = require('./CodeTable')


class DependTrade extends React.component{
  componentWillMount(){

  }
  componentDidMount(){
    var words = Code.stockData()

    $('.search').autocomplete({
      hints: words,
    });
  }
  render(){
    var kk = window.document.body.offsetHeight
    return(
      <div>
        <div className='col-sm-10' style={{height: kk/3}}>
            <TradePanel />
        </div> 
        <div className='col-sm-2' style={{height: kk/3}}>十档行情</div> 
        <SearchInput />
      </div>
    )
  }
}