import React, {useEffect, useState} from 'react'
import axios from 'axios';
import Perks from '../components/Perks';
import PhotosUploader from '../components/PhotosUploader';
import AccountNav from './AccountNav';
import { useParams, Navigate } from 'react-router-dom';

const PlacesFormPage = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState('');
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(100);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!id){
            return;
        }
        axios.get('/places/' + id).then((response) => {
            const {data} = response;
            setTitle(data.title)
            setAddress(data.address)
            setAddedPhotos(data.photos)
            setDescription(data.description)
            setPerks(data.perks)
            setExtraInfo(data.extraInfo)
            setCheckIn(data.checkIn)
            setCheckOut(data.checkOut)
            setMaxGuests(data.maxGuests)
            setPrice(data.price)
        })
    }, [id])

    function preInput(header, description){
        return(
            <>
                <h2 className='text-2xl mt-4'>{header}</h2>
                <p className='text-gray-500 text-sm'>{description}</p>
            </>
        )
    }

    async function savePlace(e){
        e.preventDefault();
        const placeData = {
            title,
            address,
            addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price
        }
        if (id){
            await axios.put('/places', {
                id,
                ...placeData
            })
        }else{
            await axios.post('/places', placeData);
        }
        setRedirect(true);
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />      
    }

    return (
        <div>
            <AccountNav />
            <form onSubmit={savePlace}>
                {preInput('Title', 'Title for your place, should be short and catchy')}
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder='title, for example: my lovely apartment' />

                {preInput('Address', 'Address to this place')}
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder='address' />
            
                {preInput('Photos', 'More = better')}
                <PhotosUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos}/>
                
                {preInput('Description', 'Description of the place')}
                <textarea placeholder='description' value={description} onChange={e => setDescription(e.target.value)} />

                {preInput('Perks', 'Select all the perks')}
                <Perks selected={perks} onChange={setPerks}/>

                {preInput('Extra info', 'House rules, etc')}
                <textarea value={extraInfo} onChange={e => setExtraInfo(e.target.value)}/>

                {preInput('Check in & out times', 'Add check in and out times, remember to have some time window for cleaning the room between guests')}
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in time</h3>
                        <input type="text"
                            value={checkIn}
                            onChange={ev => setCheckIn(ev.target.value)}
                            placeholder="14"/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out time</h3>
                        <input type="text"
                            value={checkOut}
                            onChange={ev => setCheckOut(ev.target.value)}
                            placeholder="11" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max number of guests</h3>
                        <input type="number" value={maxGuests}
                            onChange={ev => setMaxGuests(ev.target.value)}/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input type="number" value={price}
                            onChange={ev => setPrice(ev.target.value)}/>
                    </div>
                    </div>
                <div>
                    <button className='primary my-4'>Save</button>
                </div>
            </form>
        </div>
    )
}

export default PlacesFormPage;