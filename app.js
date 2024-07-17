
const endpoint = 'https://crudcrud.com/api/4cef3d1b293c492e88c7502d9977b86c/bookings';


// function handleFormSubmit(){

// }
let bookingId = 0;

let bookings=[];



window.onload = ()=>{
  axios.get(endpoint)
  .then(res=>{
    console.log(res);
    bookings = res.data;
    renderBusList(bookings);
    console.log(bookings)
  })
  .catch(e=>console.error(e));
}

const handleFormSubmit = ()=>{
  const busOptions = ['Bus1', 'Bus2', 'Bus3'];

  const name = document.getElementById('name')?.value;
  const ele = document.getElementById('name');


  const email = document.getElementById('email')?.value;
  const phone = document.getElementById('phone')?.value;
  const selectedBusIndex = document.getElementById('bus-number')?.selectedIndex;
  const bus = busOptions[selectedBusIndex];

  const alreadyBooked = ele.getAttribute('alreadybooked')??false;
  const alreadyBookedItemBookingId = ele.getAttribute('bookingId');

  if(name =='' || email == '' || phone == ""){
    alert('Fill the detail');
    return; 
  }

  console.log(alreadyBooked, 'alreadyBooked');

  if(!alreadyBooked){
     
    axios.post(endpoint, {name, email, phone, bus})
    .then(res=>{
      console.log(res);
      bookings.push(res.data);
      renderBusList(bookings);
    })
    .catch(e=>console.error(e)) 
  }

  if(alreadyBooked){
    const editItem = bookings.find(item=>alreadyBookedItemBookingId == item._id);
    console.log(editItem, 'item to edit');
    

    axios.put(`${endpoint}/${editItem._id}`, {name, email, phone, bus})
    .then(res=>{
      editItem.name = name;
      editItem.email = email;
      editItem.phone = phone;
      editItem.bus = bus;

      renderBusList(bookings);
    })
    .catch(e=>console.error(e))

    ele.removeAttribute('alreadybooked');
    ele.removeAttribute('bookingid');
  }
  
}

//delte bus event handler / function
function deleteBus(id){
  console.log('delete bus with id ', id);
  
  axios.delete(`${endpoint}/${id}`)
  .then(res=>{
    //fetch fresh list
    axios.get(endpoint)
    .then(res2=>{bookings = res2.data});    
    console.log(bookings)
    renderBusList(bookings);
  })
  .catch(e=>console.error(e));
}

//edit bus event handler
function editBus(id){
  console.log('edit bus with id ', id);
  const optionsList = ['Bus1', 'Bus2', 'Bus3'];

  const bookingItem = bookings.find((item)=> item._id == id);
  const busIndex = optionsList.indexOf(bookingItem.bus);

  const name = document.getElementById('name');
  name.value = bookingItem.name;
  name.setAttribute('alreadybooked', true);
  name.setAttribute('bookingid', id);
  
  document.getElementById('email').value = bookingItem.email;
  document.getElementById('phone').value = bookingItem.phone ;
  document.getElementById('bus-number').selectedBusIndex = 
  document.getElementById('bus-number').selectedIndex = busIndex;
}


const renderBusList = (list)=>{
  
  const bookingsListDiv = document.getElementById('booked_buses_list');  

  bookingsListDiv.innerHTML = '';



  list.forEach(booking=>{
    const outerDiv = document.createElement('div');
    outerDiv.style = `display: flex; gap : 8px`;
    outerDiv.id = booking._id;
  
    const nameParagraph = document.createElement('p');
    nameParagraph.innerHTML = booking.name;
    outerDiv.appendChild(nameParagraph);
  
    const emailParagraph=document.createElement('p');
    emailParagraph.innerHTML= booking.email;
    outerDiv.appendChild(emailParagraph);
  
    const phoneParagraph=document.createElement('p');
    phoneParagraph.innerHTML= booking.phone;
    outerDiv.appendChild(phoneParagraph);
  
    const busParagraph=document.createElement('p');
    busParagraph.innerHTML= booking.bus;
    outerDiv.appendChild(busParagraph);
  
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = ()=>{deleteBus(booking._id)}
  
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit'
    editButton.onclick = ()=>{editBus(booking._id)}
  
    outerDiv.appendChild(deleteButton);
    outerDiv.appendChild(editButton);
  
    bookingsListDiv.appendChild(outerDiv);
  });

}

const handleFilteredList = ()=>{
  const filter = document.getElementById('filter-select').value;

  if(filter == 'All'){
    renderBusList(bookings);
    return;
  }

  const filteredBookings = bookings.filter(item=>item.bus == filter);
  renderBusList(filteredBookings);
}















