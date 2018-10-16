import React from 'react'
import {Query} from 'react-apollo'
import {Card, Col, Icon, Avatar, Row} from 'antd'

import {USER} from '../../queries'

const {Meta} = Card

function UserProfile({history}) {
  const token = localStorage.getItem('token')
  return (
    <React.Fragment>
      <Query query={USER} variables={{token}}>
        {({loading, error, data}) => {
          if (loading) return 'Loading...'
          if (error) return 'Something went wrong!'
          return (
            <Row style={{marginTop: '70px'}}>
              <Col span={7} offset={8}>
                <Card
                  style={{width: 500}}
                  actions={[
                    <Icon
                      type="edit"
                      onClick={() =>
                        history.push(`/profile/user/${data.user._id}`)
                      }
                    />
                  ]}
                >
                  <Meta
                    avatar={<Avatar src={''} />}
                    title={`${data.user.name} ${data.user.lastname}`}
                    description={data.user.email}
                  />
                </Card>
              </Col>
            </Row>
          )
        }}
      </Query>
    </React.Fragment>
  )
}

export default UserProfile
