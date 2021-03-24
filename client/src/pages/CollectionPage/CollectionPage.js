import React, { useState, useEffect } from 'react'
import axios from 'axios'

import styles from './ThirdPage.module.css';

import PlaceCard from '../../components/PlaceCard/PlaceCard';
import { withRouter } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../actions/user_action';
import Favorite from './Favorite';
function CollectionPage(props) {

    const [places, setPlaces] = useState([])
    const [collection, setCollection] = useState({});
    const [userId, setUserId] = useState("")

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(auth()).then(response => {
            if (response.payload.isAuth) {
                setUserId(response.payload._id)
            }
        })
    }, [])

    useEffect(() => {
        axios.get(`/api/places/${props.location.state.collection._id}`).then((response) => {
            setPlaces(response.data)
        })

        axios.get(`/api/collections/${props.location.state.collection._id}`).then((response) => {
            setCollection(response.data.collection)
        })
    }, []);

    const onDeleteHandler = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios.delete(`/api/collections/${props.location.state.collection._id}`).then((response) => {
                if (response.data.success) {
                    props.history.push('/myPage');
                }
            })
        }
    }

    const onUpdateHandler = () => {
        props.history.push(`makeCollection/${props.location.state.collection._id}`)
    }

    return (
        <div className={styles.thirdPage}>
            {/* <div className={styles.left}> */}
            <div>
                <div className={styles.text}>
                    특정 카테고리명 &#8250; {collection.title}
                </div>
                <div>
                    {collection.content}
                </div>
                {(userId == collection.creator) ?
                    <div>
                        <button onClick={onDeleteHandler} className={styles.like}>삭제</button>
                        <button onClick={onUpdateHandler} className={styles.like}>수정</button>
                    </div> :
                    <Favorite collection={collection} collectionId={collection._id} userId={userId}/>
                }
            </div>
            <div className={styles.gridContainer}>
                {places.map((place) => (
                    <PlaceCard collection={props.location.state.collection._id} place={place.placeId} key={place.placeId._id} />
                ))}

            </div>
            {/* </div> */}
            {/* <div className={styles.right}>
                지도
            </div> */}
        </div>
    )
}

export default withRouter(CollectionPage)
