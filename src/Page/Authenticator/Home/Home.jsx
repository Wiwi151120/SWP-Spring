
import ComHeader from "../../Components/ComHeader/ComHeader";
import { useEffect, useRef, useState } from "react";
import { getData } from "../../../api/api";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from "react-router-dom";


import './styles.css'
export default function Home() {
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const containerRef = useRef(null);
    const fetchData = async (pageNumber) => {
        try {
            const response = await getData(`/artwork?page=${pageNumber}&limit=20`);
            return response.data.docs;
        } catch (error) {
            console.log(error);
            return [];
        }
    };
    const fetchMoreProducts = async () => {
        const newProducts = await fetchData(page + 1);
        if (newProducts.length === 0) {
            setHasMore(false); // No more data to load
        } else {
            setProducts([...products, ...newProducts]);

            setPage(page + 1);
        }
    };

    




    return (
        <>
            <ComHeader />
         
            <InfiniteScroll
                dataLength={products.length}
                next={fetchMoreProducts}
                hasMore={hasMore}
            // loader={<h4>Loading...</h4>}
            >
                <div className="pin_container" ref={containerRef}>
                    {products.map((artwork, index) => (
                        <Link to={`/artwork/${artwork._id}`} className={`card`} key={index} >
                            <div className="relative group">
                                <img
                                    className="rounded-md p-1 artwork-image"
                                    src={artwork.image}
                                    style={{ borderRadius: '24px' }}
                                    alt={artwork.imageAlt}
                                    onLoad={() => containerRef.current.dispatchEvent(new Event('load'))}
                                />
                                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-white text-2xl" >  Thể Loại:</p>
                                    {artwork?.genre.map((genre, index) => (
                                        <p className={`text-white text-xl ${index >= 3 ? 'hidden' : ''}`} key={index}>{genre}</p>
                                    ))}
                                </div>
                            </div>


                        </Link>
                    ))}
                </div>
            </InfiniteScroll>

        </>
    );
}