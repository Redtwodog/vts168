import { useMemo, useState } from 'react'
import { Card, Col, Grid, Input, Row, Space, Table, Tag, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { lapRecordsWithVideos } from './data/lapRecordVideos'
import logo from './static/bilibili.svg'

const { Title, Paragraph, Text } = Typography
const { useBreakpoint } = Grid

function renderRecordName(record, className) {
  const firstVideo = record.videos?.[0]

  if (!firstVideo || !firstVideo.link) {
    return (
      <Text strong className={className}>
        {record.name}
      </Text>
    )
  }

  return (
    <a
      href={firstVideo.link}
      target="_blank"
      rel="noreferrer"
      className={className ? `record-link ${className}` : 'record-link'}
      title={firstVideo.title}
    >
      {record.name} <img src={logo} alt="B站视频链接" className="video-link-icon" />
    </a>
  )
}

const columns = [
  {
    title: '排名',
    dataIndex: 'rank',
    key: 'rank',
    width: 78,
    fixed: 'left',
    sorter: (a, b) => a.rank - b.rank,
  },
  {
    title: '车型',
    dataIndex: 'name',
    key: 'name',
    width: 220,
    fixed: 'left',
    render: (_, record) => renderRecordName(record),
  },
  {
    title: '排量',
    dataIndex: 'displacement',
    key: 'displacement',
    width: 92,
  },
  {
    title: '变速箱',
    dataIndex: 'gearbox',
    key: 'gearbox',
    width: 100,
  },
  {
    title: '驱动形式',
    dataIndex: 'drive',
    key: 'drive',
    width: 110,
    render: (value) => {
      const colorMap = {
        前置前驱: 'blue',
        前置后驱: 'volcano',
        中置后驱: 'orange',
        前置四驱: 'green',
      }

      return <Tag color={colorMap[value]}>{value}</Tag>
    },
  },
  {
    title: '马力 (PS)',
    dataIndex: 'powerPs',
    key: 'powerPs',
    width: 110,
    sorter: (a, b) => a.powerPs - b.powerPs,
  },
  {
    title: '前轮规格',
    dataIndex: 'frontTire',
    key: 'frontTire',
    width: 140,
  },
  {
    title: '后轮规格',
    dataIndex: 'rearTire',
    key: 'rearTire',
    width: 140,
  },
  {
    title: '预算',
    dataIndex: 'budget',
    key: 'budget',
    width: 112,
    sorter: (a, b) => Number(`${a.budget}`.split('w')[0]) - Number(`${b.budget}`.split('w')[0]),
  },
  {
    title: '车手',
    dataIndex: 'driver',
    key: 'driver',
    width: 92,
  },
  {
    title: '评分',
    dataIndex: 'score',
    key: 'score',
    width: 140,
    sorter: (a, b) => a.score - b.score,
  },
  {
    title: '圈速',
    dataIndex: 'time',
    key: 'time',
    width: 110,
    fixed: 'right',
    sorter: (a, b) => a.time.localeCompare(b.time),
    render: (value) => <Text strong>{value}</Text>,
  },
]

function App() {
  const [keyword, setKeyword] = useState('')
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const filteredRecords = useMemo(() => {
    const query = keyword.trim().toLowerCase()

    if (!query) {
      return lapRecordsWithVideos
    }

    return lapRecordsWithVideos.filter((record) =>
      Object.values(record).some((value) =>
        String(value).toLowerCase().includes(query),
      ),
    )
  }, [keyword])

  return (
    <div className="page-shell">
      <div className="page-backdrop" />
      <main className="page-content">
        <section className="hero">
          <Row gutter={[24, 24]} align="bottom">
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={60} style={{ gap: '16px' }}>
                <Text className="eyebrow">VTS LAP RECORDS</Text>
                <Title className="hero-title" level={1}>
                  VTS-168节目中锐思赛道各类车型圈速纪录总览
                </Title>
                <Paragraph className="hero-description">
                  你可以直接在表格右上角输入关键字，按车型、轮胎、驱动形式、车手或任意列内容快速过滤结果。
                </Paragraph>
              </Space>
            </Col>
          </Row>
        </section>

        <Card
          className="table-card"
          bordered={false}
          title="圈速列表"
          extra={
            <Input
              allowClear
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              prefix={<SearchOutlined />}
              placeholder="搜索任意列内容"
              className="record-search"
            />
          }
        >
          {isMobile ? (
            <div className="mobile-records">
              {filteredRecords.map((record) => (
                <article key={record.key} className="mobile-record-card">
                  <div className="mobile-record-header">
                    <div>
                      <Text className="mobile-rank">#{record.rank}</Text>
                      <Title level={4} className="mobile-record-title">
                        {renderRecordName(record, 'mobile-record-link')}
                      </Title>
                    </div>
                    <div className="mobile-time-block">
                      <Text className="mobile-time-label">圈速</Text>
                      <Text className="mobile-time-value">{record.time}</Text>
                    </div>
                  </div>

                  <div className="mobile-tags">
                    <Tag color="gold">{record.budget}</Tag>
                    <Tag color="geekblue">{record.gearbox}</Tag>
                    <Tag color="purple">{record.displacement}</Tag>
                    <Tag
                      color={
                        record.drive === '前置前驱'
                          ? 'blue'
                          : record.drive === '前置后驱'
                            ? 'volcano'
                            : record.drive === '中置后驱'
                              ? 'orange'
                              : 'green'
                      }
                    >
                      {record.drive}
                    </Tag>
                  </div>

                  <div className="mobile-spec-grid">
                    <div className="mobile-spec-item">
                      <Text className="mobile-spec-label">马力</Text>
                      <Text className="mobile-spec-value">{record.powerPs} PS</Text>
                    </div>
                    <div className="mobile-spec-item">
                      <Text className="mobile-spec-label">评分</Text>
                      <Text className="mobile-spec-value">{record.score}</Text>
                    </div>
                    <div className="mobile-spec-item">
                      <Text className="mobile-spec-label">前轮</Text>
                      <Text className="mobile-spec-value">{record.frontTire}</Text>
                    </div>
                    <div className="mobile-spec-item">
                      <Text className="mobile-spec-label">后轮</Text>
                      <Text className="mobile-spec-value">{record.rearTire}</Text>
                    </div>
                    <div className="mobile-spec-item">
                      <Text className="mobile-spec-label">车手</Text>
                      <Text className="mobile-spec-value">{record.driver}</Text>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Table
              rowKey="key"
              columns={columns}
              dataSource={filteredRecords}
              pagination={{ pageSize: 60, showSizeChanger: false }}
              scroll={{ x: 1500 }}
            />
          )}
        </Card>
      </main>
    </div>
  )
}

export default App
