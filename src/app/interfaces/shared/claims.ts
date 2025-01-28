interface IClaimAdmin {
   
}

interface IClaimUser {

}

interface IClaimShared {

}

type IClaimsKeys = keyof IClaimAdmin | keyof IClaimUser | keyof IClaimShared;

export default IClaimsKeys