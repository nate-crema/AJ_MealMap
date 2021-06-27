
// components - etc
import Block from "../../components/Block";


function Main({ blocks, boxSize, changeMenuUI, menu, onClick }) {
    return (
        <div className="contentWrap menuComp" id="menuRef" style={{ 
            opacity: (menu == 0) ? 1 : 0, 
            marginTop: (menu == 0) ? "0px" : "10px"
        }}>
            {blocks.map((v, i) => {
                return (
                    <Block
                        title={v.title}
                        subtext={v.subtext}
                        color="#005BAE"
                        boxSize={boxSize}
                        style={{
                            gridArea: `block_${i+1}`,
                            cursor: (!v.clickUnavailable) && "pointer"
                        }}
                        img={v.img}
                        imgCss={v.imgCss && v.imgCss}
                        subTextCss={v.subTextCss && v.subTextCss}
                        menu={i+1}
                        changeMenuUI={(e) => ((!v.clickUnavailable) && changeMenuUI(i))}
                        onClick={ onClick || new function(){}}
                    >
                    </Block>
                )
            })}
        </div>
    )
}

export default Main;