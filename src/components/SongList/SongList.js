import React from 'react';
import {
  Input,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  Col,
  Form,
  Row
} from "reactstrap";
import { getSongList } from './store/songList.actions';
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component"


class SongList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey : "",
      offset : 0,
      limit : 10,
      showPlayer : false,
      selectedSrc : ""
    };
    this.lastRequestId = null;
  }

  handleSearch = (e) => {
    this.setState({
      ...this.state,
      searchKey : e.target.value,
      offset : 0
    })
    if(e.target.value.length > 0){
      
      if (this.lastRequestId !== null) {
        clearTimeout(this.lastRequestId);
      }
      this.lastRequestId = setTimeout(async () => {
        await this.props.getSongList(this.state);
      }, 1000);
    }
    
  }

  fetchMoreData = async() => {
    this.setState({
      ...this.state,
      offset : this.state.offset+this.state.limit 
    })

    await this.props.getSongList(this.state);
  }

  playSong = async(item) => {
    this.setState({
      ...this.state,
      selectedSrc : item.preview_url,
      showPlayer : true
    })
  }

  closePlayer = () => {
    this.setState({
      ...this.state,
      showPlayer : false,
      selectedSrc : ""
    })
  }

  render() {
    return (
      <React.Fragment>

        <div className="m-5">
          <h2> Welcome To Spotify Test APP</h2>
          <Form>
            <Input
              type="text"
              value={this.state.searchKey}
              className="search-bar"
              onChange={this.handleSearch}
              placeholder="Search your favourite Songs"
            />
          </Form>
              {this.props.apiCalled && <InfiniteScroll
                dataLength={this.props.songList.length}
                next={this.fetchMoreData}
                hasMore={this.props.hasMore}
                loader={<h4>Loading...</h4>}
                height={400}
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
              >
               
                  <Row>
                    {this.props.songList.length > 0 && this.props.songList.map(item => {
                      return(
                        <Col xs="3" key={item.id}>
                          <Card onClick={() => this.playSong(item)}>
                            <CardImg top width="100%" src={item.album.images[0].url} alt="Card image cap" />
                            <CardBody>
                              <CardTitle tag="h5">{item.album.name}</CardTitle>
                            </CardBody>
                          </Card>
                        </Col>
                      
                      )  
                    })}
                  </Row>
              </InfiniteScroll>}
        </div>

        {this.state.showPlayer && (
        <div className="audio-outer">
          <audio src={this.state.selectedSrc} autoPlay controls />
          <button onClick={this.closePlayer}>
            Close Player
          </button>
        </div>
      )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ songList }) => ({
  songList : songList.songList,
  hasMore :songList.hasMore,
  apiCalled : songList.apiCalled
});

const mapDispatchToProps = {
    getSongList
};

export default connect(mapStateToProps, mapDispatchToProps)(SongList);


