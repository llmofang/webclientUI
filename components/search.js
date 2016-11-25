var React = require('react')

class SearchInput extends React.Component{

  render(){
    return(
       <div className={this.props.name+' search'}> </div>
      )
  }
}

module.exports = SearchInput