import React from 'react'
import {compose} from 'recompose'
import {withRouter} from 'react-router-dom'
import {Avatar, Layout, List, Row, Col, Button, Pagination} from 'antd'
import {Query, Mutation} from 'react-apollo'

import {LIST_PUBLICATIONS, REMOVE_PUBLICATION} from '../../queries'
import withUser from '../../HOC/withUser'
import DeleteMutation from '../Form/DeleteMutation'

const {Content} = Layout

function onLoadMore(fetchMore, {listPublications}) {
  console.log('Load more!')
  return fetchMore({
    variables: {
      offset: listPublications.length
    },
    updateQuery: (prev, {fetchMoreResult}) => {
      if (!fetchMoreResult) return prev
      return {
        prev,
        ...{
          listPublications: [
            ...prev.listPublications,
            ...fetchMoreResult.listPublications
          ]
        }
      }
    }
  })
}

function ListPublication({user, history}) {
  return (
    <Query query={LIST_PUBLICATIONS} variables={{limit: 3, offset: 0}}>
      {({data, loading, fetchMore, refetch}) => {
        if (loading) return null
        return (
          <Content style={{padding: '50px 300px 50px 300px'}}>
            <List
              itemLayout="vertical"
              size="large"
              dataSource={data.listPublications}
              renderItem={publication => {
                return (
                  <List.Item
                    key={publication._id}
                    extra={
                      <img
                        width={250}
                        height={200}
                        alt="logo"
                        src={
                          !publication.imageUrl
                            ? 'https://image.shutterstock.com/image-illustration/404-funny-cats-design-260nw-757415008.jpg'
                            : publication.imageUrl
                        }
                      />
                    }
                  >
                    <p>
                      By:{' '}
                      <Avatar
                        size={30}
                        shape="circle"
                        style={{marginRight: '5px'}}
                        src={publication.user.imageUrl}
                      />
                      {publication.user.nickname} {publication.formatDate}
                    </p>
                    <List.Item.Meta title={publication.title} />
                    <div>{publication.description}</div>
                    <div>{publication.content}</div>
                    <React.Fragment>
                      {user && (
                        <Row
                          type="flex"
                          justify="start"
                          style={{marginTop: '25px'}}
                        >
                          <Col span={3}>
                            <Button
                              type="primary"
                              onClick={() =>
                                history.push(`/publications/${publication._id}`)
                              }
                            >
                              Update
                            </Button>
                          </Col>
                          <Col span={5}>
                            <Mutation mutation={REMOVE_PUBLICATION}>
                              {deletePublication => (
                                <DeleteMutation
                                  _id={publication._id}
                                  mutation={deletePublication}
                                  refetch={refetch}
                                />
                              )}
                            </Mutation>
                          </Col>
                        </Row>
                      )}
                    </React.Fragment>
                  </List.Item>
                )
              }}
            />
            <div style={{textAlign: 'center'}}>
              <Button
                onClick={() => onLoadMore(fetchMore, data)}
                style={{marginTop: '40px'}}
              >
                Load More!
              </Button>
            </div>
          </Content>
        )
      }}
    </Query>
  )
}

export default compose(
  withRouter,
  withUser
)(ListPublication)
